import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStaticPage extends Document {
  slug: string; // e.g., 'faq', 'terms-and-conditions'
  title: string;
  content: string; // Can be Markdown or HTML
  metaTitle?: string;
  metaDescription?: string;
}

const StaticPageSchema: Schema<IStaticPage> = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
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

const StaticPage: Model<IStaticPage> = mongoose.model<IStaticPage>('StaticPage', StaticPageSchema);
export default StaticPage;