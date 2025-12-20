import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { PaperAirplaneIcon } from '../../icons/PaperAirplaneIcon';
import { ChatBubbleBottomCenterTextIcon } from '../../icons/ChatBubbleBottomCenterTextIcon';
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon';
import { ChatMessage, UserFeatures } from '../../../types'; 
import UpgradePrompt from '../../common/UpgradePrompt';
import apiClient from '../../../utils/apiClient';
import { useToast, useSocket } from '../../../hooks/useToast';

interface MessagesViewProps {
  userFeatures: UserFeatures;
  currentUserId: string; 
  onUpgradeClick: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ userFeatures, currentUserId, onUpgradeClick }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState({ convos: true, messages: false });
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const socket = useSocket();
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const getRoomName = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  const fetchConversations = useCallback(async () => {
    setIsLoading(prev => ({...prev, convos: true}));
    try {
      const data = await apiClient('/api/messages/conversations');
      setConversations(data);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsLoading(prev => ({...prev, convos: false}));
    }
  }, [showToast]);
  
  useEffect(() => {
    fetchConversations();
    
    socket.emit('authenticate', currentUserId);

    const handleReceiveMessage = (message: any) => {
        const currentActiveChat = activeChatRef.current;
        if (currentActiveChat && message.conversation === currentActiveChat.id) {
            setMessages(prev => [...prev, {
                id: message._id,
                sender: message.sender._id === currentUserId ? 'user' : 'other',
                text: message.text,
                timestamp: message.createdAt,
                status: 'delivered'
            }]);
        }
    };

    const handleConversationUpdate = (updatedConvo: any) => {
        setConversations(prev => {
            const existing = prev.find(c => c.id === updatedConvo._id);
            if(existing) {
                return [updatedConvo, ...prev.filter(c => c.id !== updatedConvo._id)];
            } else {
                return [updatedConvo, ...prev];
            }
        });
    };
    
    socket.on('receive_private_message', handleReceiveMessage);
    socket.on('conversation_updated', handleConversationUpdate);

    return () => {
      socket.off('receive_private_message', handleReceiveMessage);
      socket.off('conversation_updated', handleConversationUpdate);
    };

  }, [fetchConversations, currentUserId, socket]);
  
  const fetchMessages = useCallback(async (participantId: string) => {
      setIsLoading(prev => ({...prev, messages: true}));
      try {
        const data = await apiClient(`/api/messages/${participantId}`);
        setMessages(data);
      } catch (err: any) {
        setError(err.message);
        showToast(err.message, 'error');
      } finally {
        setIsLoading(prev => ({...prev, messages: false}));
      }
  }, [showToast]);

  useEffect(() => {
    if (activeChat?.otherParticipant?.id) {
        const roomName = getRoomName(currentUserId, activeChat.otherParticipant.id);
        socket.emit('join_chat_room', roomName);
        fetchMessages(activeChat.otherParticipant.id);
    }
    return () => {
      if (activeChat?.otherParticipant?.id) {
        const roomName = getRoomName(currentUserId, activeChat.otherParticipant.id);
        socket.emit('leave_chat_room', roomName);
      }
    };
  }, [activeChat, fetchMessages, currentUserId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;
    
    const optimisticMessage: ChatMessage = {
      id: Date.now(), sender: 'user', text: messageInput, 
      timestamp: new Date().toISOString(), status: 'sent'
    };
    setMessages(prev => [...prev, optimisticMessage]);
    
    socket.emit('send_private_message', {
        fromUserId: currentUserId,
        toUserId: activeChat.otherParticipant.id,
        text: messageInput
    });
    
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (isLoading.convos) return <p>Loading conversations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3"><ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-rose-500" /><h2 className="text-2xl font-semibold text-gray-800">Messages</h2></div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{height: 'calc(100vh - 200px)'}}>
        <div className="flex h-full">
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b"><Input id="searchContacts" name="searchContacts" label="" placeholder="Search contacts..." className="[&_label]:sr-only !mb-0" /></div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {conversations.map(convo => (
                        <div key={convo.id} onClick={() => setActiveChat(convo)} className={`flex items-center p-3 cursor-pointer hover:bg-rose-50 ${activeChat?.id === convo.id ? 'bg-rose-100' : ''}`}>
                            <img src={convo.otherParticipant?.profilePhotoUrl || 'https://via.placeholder.com/48'} alt={convo.otherParticipant?.fullName} className="w-12 h-12 rounded-full object-cover" />
                            <div className="ml-3 flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-800">{convo.otherParticipant?.fullName}</h3>
                                <p className="text-xs text-gray-600 truncate">{convo.lastMessage?.text || 'No messages yet'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeChat ? (
                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="p-3 border-b flex items-center"><Button onClick={() => setActiveChat(null)} className="md:hidden !p-1 mr-2"><ArrowLeftIcon className="w-5 h-5"/></Button><img src={activeChat.otherParticipant?.profilePhotoUrl || 'https://via.placeholder.com/40'} alt={activeChat.otherParticipant?.fullName} className="w-10 h-10 rounded-full object-cover" /><div className="ml-2"><h3 className="text-sm font-semibold text-gray-800">{activeChat.otherParticipant?.fullName}</h3></div></div>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 custom-scrollbar">
                        {isLoading.messages ? <p>Loading messages...</p> : messages.map(msg => (
                            <div key={msg.id.toString()} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`max-w-[70%] px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-rose-200' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    {userFeatures.canChat ? (
                        <div className="p-3 border-t bg-white flex items-center space-x-2">
                             <Button variant="secondary" size="sm" className="!p-2" title="Attach file" disabled={!userFeatures.canShareMedia}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 0119.5 7.372v8.25a2.25 2.25 0 01-4.5 0v-6.75a.75.75 0 00-1.5 0v6.75a3.75 3.75 0 007.5 0v-8.25a4.875 4.875 0 00-8.625-3.443l-10.94 10.94a6.375 6.375 0 009.012 9.012l7.693-7.693-1.5-1.5z" />
                                </svg>
                             </Button>
                             <Input id="messageInput" name="messageInput" label="" placeholder="Type a message..." value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyPress={handleKeyPress} className="flex-grow [&_label]:sr-only !mb-0"/>
                             <Button variant="primary" size="sm" onClick={handleSendMessage} className="!p-2 !bg-rose-500 hover:!bg-rose-600" title="Send message"><PaperAirplaneIcon className="w-5 h-5"/></Button>
                        </div>
                    ) : (
                        <div className="p-3 border-t bg-white"><UpgradePrompt featureName="unlimited messaging" onUpgradeClick={onUpgradeClick} size="small" /></div>
                    )}
                </div>
            ) : ( <div className="w-full md:w-2/3 flex-col items-center justify-center text-center p-10 hidden md:flex"><ChatBubbleBottomCenterTextIcon className="w-16 h-16 text-gray-300" /><h3 className="mt-2 text-lg font-medium text-gray-700">Select a conversation</h3></div> )}
        </div>
      </div>
    </div>
  );
};
