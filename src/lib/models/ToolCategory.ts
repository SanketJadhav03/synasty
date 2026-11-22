import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IToolCategory extends Document {
  name: string;
  slug: string;
}

const ToolCategorySchema = new Schema<IToolCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export const ToolCategory: Model<IToolCategory> =
  mongoose.models.ToolCategory || mongoose.model<IToolCategory>('ToolCategory', ToolCategorySchema);
export default ToolCategory;
