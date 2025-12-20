import mongoose, { Schema, Document, Model } from 'mongoose';
import { NotificationType } from '../../../types.js';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  redirectTo?: string;
  senderProfile?: mongoose.Types.ObjectId;
}

const NotificationSchema: Schema<INotification> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  redirectTo: { type: String },
  senderProfile: { type: Schema.Types.ObjectId, ref: 'User' },
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

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;