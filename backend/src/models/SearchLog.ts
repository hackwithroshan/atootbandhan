import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISearchLog extends Document {
  userId: mongoose.Types.ObjectId;
  params: {
    keyword?: string;
    religion?: string;
    city?: string;
    caste?: string;
  };
  resultCount: number;
}

const SearchLogSchema: Schema<ISearchLog> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  params: {
    keyword: String,
    religion: String,
    city: String,
    caste: String,
  },
  resultCount: { type: Number, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } }); // Only need createdAt

const SearchLog: Model<ISearchLog> = mongoose.model<ISearchLog>('SearchLog', SearchLogSchema);
export default SearchLog;