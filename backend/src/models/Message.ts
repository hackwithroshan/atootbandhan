import mongoose, { Schema, Document, Model } from 'mongoose';
import { ChatMessageStatus } from '../../../types.js';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  status: ChatMessageStatus;
}

const MessageSchema: Schema<IMessage> = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' },
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;