import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdvertisement extends Document {
  placement: 'header' | 'sidebar' | 'in-content' | 'footer';
  isEnabled: boolean;
  adClient: string;
  adSlot: string;
  customHtml?: string;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    placement: {
      type: String,
      enum: ['header', 'sidebar', 'in-content', 'footer'],
      required: true,
      unique: true,
    },
    isEnabled: { type: Boolean, default: false },
    adClient: { type: String, default: '' },
    adSlot: { type: String, default: '' },
    customHtml: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Advertisement: Model<IAdvertisement> =
  mongoose.models.Advertisement ||
  mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);
export default Advertisement;
