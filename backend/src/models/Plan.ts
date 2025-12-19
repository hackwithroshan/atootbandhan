import mongoose, { Schema, Document, Model } from 'mongoose';
import { MembershipTier } from '../../types.js';

export interface IPlan extends Document {
  name: MembershipTier;
  priceMonthly: string;
  priceYearly?: string;
  highlight?: boolean;
  features: { text: string; included: boolean }[];
  cta: string;
}

const PlanSchema: Schema<IPlan> = new Schema({
  name: { type: String, enum: Object.values(MembershipTier), required: true, unique: true },
  priceMonthly: { type: String, required: true },
  priceYearly: { type: String },
  highlight: { type: Boolean, default: false },
  features: [{ text: String, included: Boolean }],
  cta: { type: String, required: true },
}, { timestamps: true });

const Plan: Model<IPlan> = mongoose.model<IPlan>('Plan', PlanSchema);
export default Plan;