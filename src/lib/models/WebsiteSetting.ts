import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWebsiteSetting extends Document {
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  faviconUrl: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
    telegram?: string;
    youtube?: string;
  };
  footerText: string;
  themeDefault: 'system' | 'dark' | 'light';
  tmdbApiKey?: string;
  tmdbEnabled: boolean;
  cacheExpiryMinutes: number;
  updatedAt: Date;
}

const WebsiteSettingSchema = new Schema<IWebsiteSetting>(
  {
    siteName: { type: String, default: 'Synasty' },
    siteUrl: { type: String, default: 'https://synasty.xyz' },
    logoUrl: { type: String, default: '/images/synasty-logo-dark.png' },
    faviconUrl: { type: String, default: '/favicon.ico' },
    defaultSeoTitle: {
      type: String,
      default: 'Synasty – Everything Digital. One Destination.',
    },
    defaultSeoDescription: {
      type: String,
      default:
        'Discover movies, explore powerful free online utilities, access useful curated digital services, and learn with technology tutorials at Synasty.',
    },
    contactEmail: { type: String, default: 'contact@synasty.xyz' },
    socialLinks: {
      twitter: { type: String, default: 'https://twitter.com/synasty' },
      github: { type: String, default: 'https://github.com/synasty' },
      discord: { type: String, default: '' },
      telegram: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    footerText: {
      type: String,
      default:
        'Synasty is an all-in-one digital ecosystem providing free developer tools, legal movie discovery, curated digital services, and insightful technology articles.',
    },
    themeDefault: {
      type: String,
      enum: ['system', 'dark', 'light'],
      default: 'system',
    },
    tmdbApiKey: { type: String, default: '' },
    tmdbEnabled: { type: Boolean, default: true },
    cacheExpiryMinutes: { type: Number, default: 60 },
  },
  { timestamps: true }
);

export const WebsiteSetting: Model<IWebsiteSetting> =
  mongoose.models.WebsiteSetting ||
  mongoose.model<IWebsiteSetting>('WebsiteSetting', WebsiteSettingSchema);
export default WebsiteSetting;
