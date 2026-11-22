import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieSource extends Document {
  movieId: mongoose.Types.ObjectId;
  sourceName: string;
  sourceType: 'stream' | 'download' | 'official';
  url: string;
  quality?: string;
  isLegalAuthorizationVerified: boolean;
  licenseNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSourceSchema = new Schema<IMovieSource>(
  {
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
    sourceName: { type: String, required: true, trim: true },
    sourceType: {
      type: String,
      enum: ['stream', 'download', 'official'],
      required: true,
      default: 'official',
    },
    url: { type: String, required: true, trim: true },
    quality: { type: String, default: 'HD 1080p' },
    isLegalAuthorizationVerified: { type: Boolean, default: true },
    licenseNote: {
      type: String,
      default: 'Public Domain / Free Rights-Holder Authorized Distribution',
    },
  },
  { timestamps: true }
);

export const MovieSource: Model<IMovieSource> =
  mongoose.models.MovieSource || mongoose.model<IMovieSource>('MovieSource', MovieSourceSchema);
export default MovieSource;
