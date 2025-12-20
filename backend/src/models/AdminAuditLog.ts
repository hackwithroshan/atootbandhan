import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details: string;
  ipAddress?: string;
}

const AdminAuditLogSchema: Schema<IAdminAuditLog> = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminName: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { type: String },
  targetId: { type: String },
  details: { type: String, required: true },
  ipAddress: { type: String },
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
      delete ret.__v;
    }
  }
});

const AdminAuditLog: Model<IAdminAuditLog> = mongoose.model<IAdminAuditLog>('AdminAuditLog', AdminAuditLogSchema);
export default AdminAuditLog;