/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "losblancosid.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  sassOptions: {
    prependData: `
      @use "@/styles/_variables.scss" as *;
      @use "@/styles/_mixins.scss" as *;
    `,
  },
};

export default nextConfig;
