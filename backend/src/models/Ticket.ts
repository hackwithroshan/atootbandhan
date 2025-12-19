import mongoose, { Schema, Document, Model } from 'mongoose';
import { SupportTicketCategory, SupportTicketStatus } from '../../types.js';

const MessageSchema = new Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  subject: string;
  category: SupportTicketCategory;
  description: string;
  status: SupportTicketStatus;
  lastUpdatedDate: Date;
  messages: { sender: 'user' | 'admin'; text: string; timestamp: Date }[];
}

const TicketSchema: Schema<ITicket> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  category: { type: String, enum: Object.values(SupportTicketCategory), required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Object.values(SupportTicketStatus), default: SupportTicketStatus.OPEN },
  lastUpdatedDate: { type: Date, default: Date.now },
  messages: [MessageSchema],
}, { timestamps: { createdAt: 'createdDate', updatedAt: 'lastUpdatedDate' } });

const Ticket: Model<ITicket> = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;