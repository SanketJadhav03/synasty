import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  slug: string;
  tmdbId?: number;
  overview: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseYear: number;
  runtime?: number;
  genres: string[];
  rating: number;
  languages: string[];
  trailerUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sourceCount: number;
  views: number;
  tmdbData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tmdbId: { type: Number, index: true },
    overview: { type: String, required: true },
    posterUrl: { type: String, required: true },
    backdropUrl: { type: String, default: '' },
    releaseYear: { type: Number, required: true },
    runtime: { type: Number, default: 0 },
    genres: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 10 },
    languages: [{ type: String, default: 'English' }],
    trailerUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    sourceCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    tmdbData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

MovieSchema.index({ title: 'text', overview: 'text' });
MovieSchema.index({ releaseYear: -1 });
MovieSchema.index({ rating: -1 });

export const Movie: Model<IMovie> = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);
export default Movie;
