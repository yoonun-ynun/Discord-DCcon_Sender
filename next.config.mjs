/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [process.env.AUTH_URL],
    productionBrowserSourceMaps: false,
};

export default nextConfig;
