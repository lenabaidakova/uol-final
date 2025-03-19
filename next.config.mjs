import { setMaxListeners } from 'events';
/** @type {import('next').NextConfig} */

setMaxListeners(20);

const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
};

export default nextConfig;
