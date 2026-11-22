import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  author: IBlogAuthor;
  readingTime: number;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImageUrl: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    author: {
      name: { type: String, default: 'Synasty Editorial Team' },
      role: { type: String, default: 'Tech & Digital Analyst' },
      avatar: { type: String, default: '/images/synasty-logo.png' },
    },
    readingTime: { type: Number, default: 3 },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'published',
    },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
BlogSchema.index({ status: 1, publishedAt: -1 });

export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
export default Blog;
