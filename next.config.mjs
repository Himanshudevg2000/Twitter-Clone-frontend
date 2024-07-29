/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        forceSwcTransforms: false,
      },
    images: {
      domains: ["avatars.githubusercontent.com"]
    }
};

export default nextConfig;
