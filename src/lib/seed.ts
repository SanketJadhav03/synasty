import { connectToDatabase } from './mongodb';
import {
  User,
  WebsiteSetting,
  Tool,
  Service,
  Blog,
  Movie,
  MovieSource,
  Advertisement,
  MovieCategory,
  BlogCategory,
  ServiceCategory,
  ToolCategory,
} from './models';
import { hashPassword } from './auth';
import { INITIAL_TOOLS, INITIAL_SERVICES, INITIAL_BLOGS } from './initialData';
import { CURATED_LEGAL_MOVIES } from './curatedMovies';

export async function runDatabaseSeed(forceReset = false) {
  const db = await connectToDatabase();
  if (!db) {
    return { success: false, message: 'Database connection not available' };
  }

  // 1. Website Settings
  let settings = await WebsiteSetting.findOne();
  if (!settings) {
    settings = await WebsiteSetting.create({
      siteName: 'Synasty',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://synasty.xyz',
      logoUrl: '/images/synasty-logo.png',
      faviconUrl: '/favicon.ico',
      defaultSeoTitle: 'Synasty – Everything Digital. One Destination.',
      defaultSeoDescription:
        'Discover movies, explore powerful free online utilities, access useful curated digital services, and learn with technology tutorials at Synasty.',
      contactEmail: 'contact@synasty.xyz',
      themeDefault: 'system',
      tmdbApiKey: process.env.TMDB_API_KEY || '',
      tmdbEnabled: true,
      cacheExpiryMinutes: 60,
    });
  }

  // 2. Initial Admin Account
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@synasty.xyz';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'SynastyAdmin2026!';
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (!existingAdmin) {
    const passwordHash = await hashPassword(adminPassword);
    await User.create({
      name: 'Synasty SuperAdmin',
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      role: 'admin',
      isBlocked: false,
    });
    console.log(`Created initial admin account: ${adminEmail}`);
  }

  // 3. Advertisements default slots
  const placements: ('header' | 'sidebar' | 'in-content' | 'footer')[] = [
    'header',
    'sidebar',
    'in-content',
    'footer',
  ];
  for (const placement of placements) {
    const exists = await Advertisement.findOne({ placement });
    if (!exists) {
      await Advertisement.create({
        placement,
        isEnabled: false,
        adClient: '',
        adSlot: '',
        customHtml: '',
      });
    }
  }

  // 4. Categories
  const movieCats = ['Horror', 'Mystery', 'Comedy', 'Classic', 'Action', 'Sci-Fi', 'Romance'];
  for (const name of movieCats) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await MovieCategory.findOneAndUpdate({ slug }, { name, slug }, { upsert: true });
  }

  const toolCats = ['Developer Utilities', 'Security & Crypto', 'Media & Barcodes', 'Text & Writing', 'Design & Colors', 'Web Utilities'];
  for (const name of toolCats) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await ToolCategory.findOneAndUpdate({ slug }, { name, slug }, { upsert: true });
  }

  const serviceCats = ['Developer Resources', 'Free AI Resources', 'Educational Resources', 'Productivity Services', 'Design Resources', 'Free Hosting Resources'];
  for (const name of serviceCats) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await ServiceCategory.findOneAndUpdate({ slug }, { name, slug }, { upsert: true });
  }

  const blogCats = ['Technology', 'Artificial Intelligence', 'Programming', 'Web Development', 'Entertainment', 'Tutorials'];
  for (const name of blogCats) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await BlogCategory.findOneAndUpdate({ slug }, { name, slug }, { upsert: true });
  }

  // 5. Seed Tools
  for (const tool of INITIAL_TOOLS) {
    await Tool.findOneAndUpdate(
      { slug: tool.slug },
      { ...tool },
      { upsert: true, new: true }
    );
  }

  // 6. Seed Services
  for (const service of INITIAL_SERVICES) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      { ...service },
      { upsert: true, new: true }
    );
  }

  // 7. Seed Blogs
  for (const blog of INITIAL_BLOGS) {
    await Blog.findOneAndUpdate(
      { slug: blog.slug },
      { ...blog },
      { upsert: true, new: true }
    );
  }

  // 8. Seed Curated Legal Movies
  for (const item of CURATED_LEGAL_MOVIES) {
    const { sources, ...movieData } = item;
    const movie = await Movie.findOneAndUpdate(
      { slug: item.slug },
      { ...movieData, sourceCount: sources.length },
      { upsert: true, new: true }
    );

    if (movie) {
      for (const src of sources) {
        await MovieSource.findOneAndUpdate(
          { movieId: movie._id, sourceName: src.sourceName },
          { ...src, movieId: movie._id },
          { upsert: true }
        );
      }
    }
  }

  return {
    success: true,
    message: 'Database initialization and seeding completed successfully.',
  };
}
