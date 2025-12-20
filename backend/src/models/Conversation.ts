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

const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;