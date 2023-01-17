/** @type {import('next').NextConfig} */
require("dotenv").config();
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CURRENT_URL: process.env.CURRENT_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    CURRENT_URL: process.env.CURRENT_URL,
    DB_URL: process.env.DB_URL,
    COOKIE_NAME: process.env.COOKIE_NAME,

    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,

    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,

    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    PUBLIC_EMAIL: process.env.PUBLIC_EMAIL,
  },
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
