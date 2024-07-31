/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        forceSwcTransforms: false,
      },
    images: {
      domains: ["avatars.githubusercontent.com","lh3.googleusercontent.com"]
    }
};

export default nextConfig;
