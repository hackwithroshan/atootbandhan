import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  image: string;
  description: string;
  buttonText: string;
  link: string;
  startDate: Date;
  endDate: Date;
  status: 'Draft' | 'Published';
}

const OfferSchema: Schema<IOffer> = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  link: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
}, { timestamps: true });

const Offer: Model<IOffer> = mongoose.model<IOffer>('Offer', OfferSchema);
export default Offer;
