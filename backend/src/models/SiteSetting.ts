import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for a singleton settings document
export interface ISiteSetting extends Document {
  siteTitle: string;
  homepageBannerText: string;
  homepageCtaText: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  contactEmail: string;
  // New fields from UI
  platformLogoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  contactMobile?: string;
  horoscopeMatchingEnabled: boolean;
  privatePhotosEnabled: boolean;
  blogModuleEnabled: boolean;
  successStoryModuleEnabled: boolean;
  paymentGatewayKey?: string;
  paymentGatewaySecret?: string;
  maintenanceMode: boolean;
  referralBonus: number;
}

const SiteSettingSchema: Schema<ISiteSetting> = new Schema({
  siteTitle: { type: String, default: 'Atut Bandhan' },
  homepageBannerText: { type: String, default: 'Find Your Perfect Match Today!' },
  homepageCtaText: { type: String, default: 'Join Free' },
  defaultMetaTitle: { type: String, default: 'Atut Bandhan - Matrimonial Site' },
  defaultMetaDescription: { type: String, default: 'Find your life partner on Atut Bandhan.' },
  contactEmail: { type: String, default: 'support@atutbandhan.com' },
  // New fields
  platformLogoUrl: { type: String },
  faviconUrl: { type: String },
  ogImageUrl: { type: String },
  contactMobile: { type: String },
  horoscopeMatchingEnabled: { type: Boolean, default: true },
  privatePhotosEnabled: { type: Boolean, default: true },
  blogModuleEnabled: { type: Boolean, default: true },
  successStoryModuleEnabled: { type: Boolean, default: true },
  paymentGatewayKey: { type: String },
  paymentGatewaySecret: { type: String },
  maintenanceMode: { type: Boolean, default: false },
  referralBonus: { type: Number, default: 200 },
}, { timestamps: true });

// Method to get the singleton document
SiteSettingSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// FIX: Changed interface extending Model to an intersection type.
// This is a more robust way to add static methods to a Mongoose model's type
// and ensures that standard model methods like .create(), .deleteMany(), etc., are preserved in the type definition.
export type ISiteSettingModel = Model<ISiteSetting> & {
    getSettings(): Promise<ISiteSetting>;
};

const SiteSetting = mongoose.model<ISiteSetting, ISiteSettingModel>('SiteSetting', SiteSettingSchema);

export default SiteSetting;