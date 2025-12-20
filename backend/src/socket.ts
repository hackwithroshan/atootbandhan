import { Server, Socket } from 'socket.io';
import Ticket from './models/Ticket.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import mongoose from 'mongoose';
import { SupportTicketStatus, SupportTicketMessage } from '../../types.js';

const initializeSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // Join a room based on the user's ID to receive personal notifications
    socket.on('authenticate', (userId: string) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} authenticated and joined room ${userId}`);
    });

    // --- Support Ticket Chat ---
    socket.on('join_ticket_room', (ticketId: string) => {
      socket.join(ticketId);
      console.log(`Socket ${socket.id} joined ticket room ${ticketId}`);
    });

    socket.on('leave_ticket_room', (ticketId: string) => {
        socket.leave(ticketId);
        console.log(`Socket ${socket.id} left ticket room ${ticketId}`);
    });

    socket.on('new_message', async (data: { 
      ticketId: string; 
      sender: 'user' | 'admin'; 
      text: string;
      file?: { url: string; name: string; type: 'image' | 'file' }
    }) => {
      const { ticketId, sender, text, file } = data;
      try {
        const ticket = await Ticket.findById(ticketId);
        if (ticket) {
          const newMessage: SupportTicketMessage = { 
              sender, 
              text, 
              timestamp: new Date().toISOString(),
              file
            };
          ticket.messages.push(newMessage as any);
          
          if(sender === 'user' && (ticket.status === SupportTicketStatus.RESOLVED || ticket.status === SupportTicketStatus.CLOSED)) {
              ticket.status = SupportTicketStatus.OPEN;
          } else if (sender === 'admin') {
              // This will re-open resolved/closed tickets if an admin replies
              ticket.status = SupportTicketStatus.IN_PROGRESS;
          }
          ticket.lastUpdatedDate = new Date();
          
          await ticket.save();

          io.to(ticketId).emit('message_received', { ticketId, message: newMessage });
          
          const populatedTicket = await Ticket.findById(ticketId).populate('user', 'fullName');
          io.emit('ticket_updated', populatedTicket); // This notifies both admin and user list views
        }
      } catch (error) {
        console.error('Error handling new_message:', error);
        socket.emit('message_error', { ticketId, error: 'Failed to save or send message.' });
      }
    });
    
    // --- Private User Chat ---
    socket.on('join_chat_room', (roomName: string) => {
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined private chat room ${roomName}`);
    });

    socket.on('leave_chat_room', (roomName: string) => {
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left private chat room ${roomName}`);
    });

    socket.on('send_private_message', async (data: { fromUserId: string; toUserId: string; text: string }) => {
        const { fromUserId, toUserId, text } = data;
        try {
            let conversation = await Conversation.findOneAndUpdate(
                { participants: { $all: [fromUserId, toUserId] } },
                { $setOnInsert: { participants: [fromUserId, toUserId] } },
                { upsert: true, new: true }
            );

            const newMessage = new Message({ conversation: conversation._id, sender: fromUserId, text });
            
            conversation.lastMessage = {
                text,
                sender: new mongoose.Types.ObjectId(fromUserId),
                timestamp: new Date(),
            };
            
            await Promise.all([newMessage.save(), conversation.save()]);

            const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'fullName profilePhotoUrl');
            const roomName = [fromUserId, toUserId].sort().join('_');

            io.to(roomName).emit('receive_private_message', populatedMessage);

            const updatedConvo = await Conversation.findById(conversation._id).populate('participants', 'fullName profilePhotoUrl');
            io.to(fromUserId).emit('conversation_updated', updatedConvo);
            io.to(toUserId).emit('conversation_updated', updatedConvo);

        } catch (error) {
            console.error('Error handling send_private_message:', error);
            socket.emit('message_error', { error: 'Failed to send message.' });
        }
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default initializeSocket;