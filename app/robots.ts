import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dearly.icu";

  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot'],
        allow: '/',
        disallow: '/g/', 
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: '/g/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}