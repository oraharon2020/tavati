import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/my-area/', '/admin/'],
    },
    sitemap: 'https://tavati.co.il/sitemap.xml',
  }
}
