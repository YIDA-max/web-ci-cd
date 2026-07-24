/**
 * 开发代理 → NestJS :10001
 * 生产构建后无代理，需配置 UMI_APP_API_URL
 */
export default {
  dev: {
    '/api/': {
      target: 'http://127.0.0.1:10001',
      changeOrigin: true,
      // 发版构建耗时长
      timeout: 600000,
      proxyTimeout: 600000,
    },
  },
  test: {
    '/api/': {
      target: 'http://127.0.0.1:10001',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'http://127.0.0.1:10001',
      changeOrigin: true,
    },
  },
};
