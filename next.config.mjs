/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    prependData: `
      @use "@/styles/_variables.scss" as *;
      @use "@/styles/_mixins.scss" as *;
    `,
  },
};

export default nextConfig;
