import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuccessStory extends Document {
  coupleName: string;
  storyText: string;
  imageUrl: string;
  weddingDate?: string;
  submittedBy: mongoose.Types.ObjectId;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const SuccessStorySchema: Schema<ISuccessStory> = new Schema({
  coupleName: { type: String, required: true },
  storyText: { type: String, required: true },
  imageUrl: { type: String, required: true },
  weddingDate: { type: String },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

const SuccessStory: Model<ISuccessStory> = mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
export default SuccessStory;
