import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.65"],
  
  // Include chromium binary files for PDF generation
  outputFileTracingIncludes: {
    '/api/generate-pdf': ['./node_modules/@sparticuz/chromium/**/*'],
  },
  
  // Increase function timeout for PDF generation
  serverExternalPackages: ['@sparticuz/chromium'],
};

export default nextConfig;
