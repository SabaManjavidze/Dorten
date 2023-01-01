/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "cdn.cdnlogo.com",
      "res.cloudinary.com",
      "cdn.pixabay.com",
      "react.semantic-ui.com",
      "dezpolycarpe.files.wordpress.com",
    ],
  },
  webpack: (config) => {
    if (!config.experiments) {
      config.experiments = {};
    }
    config.experiments.topLevelAwait = true;
    return config;
  },
};

module.exports = nextConfig;
