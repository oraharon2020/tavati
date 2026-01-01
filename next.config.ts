import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.65"],
  
  // Include chromium binary files for PDF generation
  outputFileTracingIncludes: {
    '/api/generate-pdf': ['./node_modules/@sparticuz/chromium/**/*'],
  },
  
  // Increase function timeout for PDF generation
  serverExternalPackages: ['@sparticuz/chromium'],
  
  // Redirect favicon.ico to icon.png
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.png',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
