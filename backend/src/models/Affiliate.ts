import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAffiliate extends Document {
  name: string;
  referralCode: string;
  commissionRate: string;
  status: 'Active' | 'Inactive';
  expiryDate?: Date;
  usersJoined: number;
  totalRevenueGenerated: number;
}

const AffiliateSchema: Schema<IAffiliate> = new Schema({
  name: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
  commissionRate: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  expiryDate: { type: Date },
  usersJoined: { type: Number, default: 0 },
  totalRevenueGenerated: { type: Number, default: 0 }, // For future implementation
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

const Affiliate: Model<IAffiliate> = mongoose.model<IAffiliate>('Affiliate', AffiliateSchema);
export default Affiliate;