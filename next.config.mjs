/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    prependData: `@use "@/styles/index.scss" as *;`,
  },
};

export default nextConfig;
