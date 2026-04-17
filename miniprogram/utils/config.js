const BASE_URLS = {
  develop: 'http://localhost:3000',
  trial: 'https://replace-with-your-test-api.example.com',
  release: 'https://replace-with-your-prod-api.example.com'
};

function getEnvVersion() {
  try {
    if (typeof __wxConfig !== 'undefined' && __wxConfig.envVersion) {
      return __wxConfig.envVersion;
    }
  } catch (e) {}
  return 'develop';
}

function getRuntimeBaseUrl() {
  const envVersion = getEnvVersion();
  return BASE_URLS[envVersion] || BASE_URLS.develop;
}

module.exports = {
  BASE_URLS,
  getEnvVersion,
  getRuntimeBaseUrl,
  // 向后兼容旧调用方式
  baseUrl: getRuntimeBaseUrl()
};
