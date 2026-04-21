/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed the 'eslint' key to stop the warning/error
};

export default nextConfig;
