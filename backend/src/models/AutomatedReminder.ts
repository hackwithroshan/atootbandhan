import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAutomatedReminder extends Document {
  rule: string;
  delayInDays: number;
  messageTemplate: string; // Placeholder for which template to use
  isActive: boolean;
}

const AutomatedReminderSchema: Schema<IAutomatedReminder> = new Schema({
  rule: { type: String, required: true, unique: true },
  delayInDays: { type: Number, required: true },
  messageTemplate: { type: String, required: true },
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

const AutomatedReminder: Model<IAutomatedReminder> = mongoose.model<IAutomatedReminder>('AutomatedReminder', AutomatedReminderSchema);
export default AutomatedReminder;