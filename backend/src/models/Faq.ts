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

const Faq: Model<IFaq> = mongoose.model<IFaq>('Faq', FaqSchema);
export default Faq;