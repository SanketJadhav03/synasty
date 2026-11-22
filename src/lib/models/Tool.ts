import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITool extends Document {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isEnabled: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: 'General' },
    icon: { type: String, default: 'Wrench' },
    isEnabled: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Tool: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);
export default Tool;
