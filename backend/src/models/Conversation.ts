import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage: {
    text: string;
    sender: mongoose.Types.ObjectId;
    timestamp: Date;
  };
}

const ConversationSchema: Schema<IConversation> = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: {
    text: String,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  },
}, { timestamps: true });

const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
