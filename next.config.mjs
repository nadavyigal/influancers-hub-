import { createHash } from 'crypto';
import crypto from 'crypto-browserify';
import stream from 'stream-browserify';
import http from 'stream-http';
import https from 'https-browserify';
import zlib from 'browserify-zlib';

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config, { isServer }) => {
    // Firebase requires these polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    
    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 90000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            priority: 20
          },
          firebase: {
            name: 'firebase',
            test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true
          },
          lib: {
            test(module) {
              return (
                module.size() > 80000 &&
                /node_modules[/\\]/.test(module.identifier())
              )
            },
            name(module) {
              // Use a simple string hash for module names
              const moduleId = module.identifier();
              let hash = 0;
              for (let i = 0; i < moduleId.length; i++) {
                hash = ((hash << 5) - hash) + moduleId.charCodeAt(i);
                hash = hash & hash; // Convert to 32bit integer
              }
              return hash.toString(16).slice(0, 8);
            },
            priority: 10,
            minChunks: 1,
            reuseExistingChunk: true
          }
        }
      }
    };
    
    return config;
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
