import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: { unoptimized: true },
  trailingSlash: true,
};

export default withMDX(nextConfig);
