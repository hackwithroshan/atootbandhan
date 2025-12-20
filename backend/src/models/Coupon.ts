import mongoose, { Schema, Document, Model } from 'mongoose';

export enum DiscountType {
  PERCENTAGE = 'Percentage',
  FIXED = 'Fixed',
}

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate?: Date;
  status: 'Active' | 'Expired' | 'Disabled';
}

const CouponSchema: Schema<ICoupon> = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: Object.values(DiscountType), required: true },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['Active', 'Expired', 'Disabled'], default: 'Active' },
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

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', CouponSchema);
export default Coupon;