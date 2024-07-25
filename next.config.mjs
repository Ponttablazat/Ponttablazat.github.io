/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	basePath: '',
	trailingSlash: true,
	assetPrefix: '',
	publicRuntimeConfig: {
		staticFolder: '/_next/static/',
	  },
};

export default nextConfig;
