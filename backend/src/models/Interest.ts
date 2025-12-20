import mongoose, { Schema, Document, Model } from 'mongoose';
import { InterestStatus } from '../../../types.js';

export interface IInterest extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  status: InterestStatus;
}

const InterestSchema: Schema<IInterest> = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(InterestStatus), default: InterestStatus.PENDING },
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

// Index to prevent duplicate interests
InterestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Interest: Model<IInterest> = mongoose.model<IInterest>('Interest', InterestSchema);
export default Interest;