import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  type: 'movie_source' | 'service' | 'general_suggestion';
  submitterName: string;
  submitterEmail: string;
  title: string;
  details: string;
  url?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    type: {
      type: String,
      enum: ['movie_source', 'service', 'general_suggestion'],
      required: true,
    },
    submitterName: { type: String, required: true, trim: true },
    submitterEmail: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    details: { type: String, required: true },
    url: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export default Submission;
