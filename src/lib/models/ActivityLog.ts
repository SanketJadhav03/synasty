import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  details: string;
  userEmail: string;
  ip?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    details: { type: String, required: true },
    userEmail: { type: String, required: true },
    ip: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
