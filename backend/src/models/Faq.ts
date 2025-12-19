import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  category: string;
}

const FaqSchema: Schema<IFaq> = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
}, { timestamps: true });

const Faq: Model<IFaq> = mongoose.model<IFaq>('Faq', FaqSchema);
export default Faq;
