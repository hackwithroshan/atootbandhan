import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IABTest extends Document {
  name: string;
  description: string;
  status: 'Running' | 'Paused' | 'Completed' | 'Draft';
  testGroup: string;
  metricsTracked: string[];
  results: {
    variantA: { views: number; conversions: number };
    variantB: { views: number; conversions: number };
  };
  startDate: Date;
  endDate?: Date;
}

const ABTestSchema: Schema<IABTest> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Running', 'Paused', 'Completed', 'Draft'], default: 'Draft' },
  testGroup: { type: String, required: true },
  metricsTracked: [{ type: String }],
  results: {
    variantA: {
      views: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    variantB: {
      views: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
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

const ABTest: Model<IABTest> = mongoose.model<IABTest>('ABTest', ABTestSchema);
export default ABTest;