/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your basePath
  basePath: '/login-test',

  // Optional: Add trailingSlash if you want URLs like /login-test/
  // trailingSlash: true,

  // Redirect root "/" to "/login-test"
  async redirects() {
    return [
      {
        source: '/',           // root URL
        destination: '/login-test', // redirect to basePath
        permanent: true,       // 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;
