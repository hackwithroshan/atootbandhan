import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnnouncementBanner extends Document {
  text: string;
  expiryDate?: Date;
  isActive: boolean;
}

const AnnouncementBannerSchema: Schema<IAnnouncementBanner> = new Schema({
  text: { type: String, required: true },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
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

const AnnouncementBanner: Model<IAnnouncementBanner> = mongoose.model<IAnnouncementBanner>('AnnouncementBanner', AnnouncementBannerSchema);
export default AnnouncementBanner;