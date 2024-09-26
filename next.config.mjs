/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "losblancosid.s3.ap-southeast-1.amazonaws.com",
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
