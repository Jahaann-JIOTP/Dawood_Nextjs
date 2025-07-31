/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/meter-data",
        destination: "http://localhost:5000/meter-data",
      },
    ];
  },
};

export default nextConfig;
