/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  agentRules: false,
  // Transpile the shared monorepo package so Next.js handles the TS source
  // directly instead of consuming the pre-compiled CJS dist, which causes
  // zod to be undefined at runtime in the browser bundle.
  transpilePackages: ["@emotion-recognition/shared"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
