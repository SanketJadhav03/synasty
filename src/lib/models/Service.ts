import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  logoUrl: string;
  officialUrl: string;
  pricingType: 'Free' | 'Freemium';
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: '' },
    officialUrl: { type: String, required: true, trim: true },
    pricingType: { type: String, enum: ['Free', 'Freemium'], default: 'Free' },
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceSchema.index({ name: 'text', description: 'text' });

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;
