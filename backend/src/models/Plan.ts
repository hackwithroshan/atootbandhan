import mongoose, { Schema, Document, Model } from 'mongoose';
import { MembershipTier } from '../../../types.js';

export interface IPlan extends Document {
  name: MembershipTier;
  priceMonthlyDisplay: string;
  priceMonthly: number;
  priceYearlyDisplay?: string;
  priceYearly?: number;
  highlight?: boolean;
  features: { text: string; included: boolean }[];
  cta: string;
}

const PlanSchema: Schema<IPlan> = new Schema({
  name: { type: String, enum: Object.values(MembershipTier), required: true, unique: true },
  priceMonthlyDisplay: { type: String, required: true },
  priceMonthly: { type: Number, required: true },
  priceYearlyDisplay: { type: String },
  priceYearly: { type: Number },
  highlight: { type: Boolean, default: false },
  features: [{ text: String, included: Boolean }],
  cta: { type: String, required: true },
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

const Plan: Model<IPlan> = mongoose.model<IPlan>('Plan', PlanSchema);
export default Plan;