import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationCampaign extends Document {
  campaignTitle: string;
  channel: 'Email' | 'SMS' | 'Both';
  messageContent: string;
  targetAudience: {
    location?: string;
    gender?: string;
    caste?: string;
    membership?: string;
  };
  status: 'Sent' | 'Scheduled' | 'Failed' | 'Draft';
  scheduledTime?: Date;
}

const NotificationCampaignSchema: Schema<INotificationCampaign> = new Schema({
  campaignTitle: { type: String, required: true },
  channel: { type: String, enum: ['Email', 'SMS', 'Both'], required: true },
  messageContent: { type: String, required: true },
  targetAudience: {
    location: String,
    gender: String,
    caste: String,
    membership: String,
  },
  status: { type: String, enum: ['Sent', 'Scheduled', 'Failed', 'Draft'], required: true },
  scheduledTime: { type: Date },
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

const NotificationCampaign: Model<INotificationCampaign> = mongoose.model<INotificationCampaign>('NotificationCampaign', NotificationCampaignSchema);
export default NotificationCampaign;