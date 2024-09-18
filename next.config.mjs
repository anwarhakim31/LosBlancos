/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  sassOptions: {
    prependData: `
      @use "@/styles/_variables.scss" as *;
      @use "@/styles/_mixins.scss" as *;
    `,
  },
};

export default nextConfig;
