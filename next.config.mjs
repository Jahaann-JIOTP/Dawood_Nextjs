/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/meter-data",
        destination: "http://110.39.23.106:5034/meter-data",
      },
    ];
  },
};

export default nextConfig;
