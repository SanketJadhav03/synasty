import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShortURL extends Document {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ShortURLSchema = new Schema<IShortURL>(
  {
    originalUrl: { type: String, required: true, trim: true },
    shortCode: { type: String, required: true, unique: true, trim: true },
    clicks: { type: Number, default: 0 },
    lastAccessedAt: { type: Date },
  },
  { timestamps: true }
);

export const ShortURL: Model<IShortURL> =
  mongoose.models.ShortURL || mongoose.model<IShortURL>('ShortURL', ShortURLSchema);
export default ShortURL;
