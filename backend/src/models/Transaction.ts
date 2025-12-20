import mongoose, { Schema, Document, Model } from 'mongoose';
import { MembershipTier } from '../../../types.js';

export enum TransactionStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  PENDING = 'Pending',
}

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  plan: MembershipTier;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  status: TransactionStatus;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: Object.values(MembershipTier), required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String },
  status: { type: String, enum: Object.values(TransactionStatus), required: true },
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

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;