/** @type {import('next').NextConfig} */
//
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "forms-image-gen-t-96.deno.dev",
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
};

export default nextConfig;
