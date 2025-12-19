import mongoose, { Schema, Document, Model } from 'mongoose';
import { InterestStatus } from '../../types.js';

export interface IInterest extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  status: InterestStatus;
}

const InterestSchema: Schema<IInterest> = new Schema({
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(InterestStatus), default: InterestStatus.PENDING },
}, { timestamps: true });

// Index to prevent duplicate interests
InterestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Interest: Model<IInterest> = mongoose.model<IInterest>('Interest', InterestSchema);
export default Interest;