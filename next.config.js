/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'fdn2.gsmarena.com',
      'fdn.gsmarena.com',
      'm.media-amazon.com',
      'priceoye.pk',
      'static-01.daraz.pk',
      'telemart.pk',
      'cdn.dxomark.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'PhoneVerse 2026',
    NEXT_PUBLIC_DEFAULT_CURRENCY: 'PKR',
    NEXT_PUBLIC_PRIMARY_MARKET: 'Pakistan',
  },
};

module.exports = nextConfig;
