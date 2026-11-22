import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

const MovieCategorySchema = new Schema<IMovieCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MovieCategory: Model<IMovieCategory> =
  mongoose.models.MovieCategory || mongoose.model<IMovieCategory>('MovieCategory', MovieCategorySchema);
export default MovieCategory;
