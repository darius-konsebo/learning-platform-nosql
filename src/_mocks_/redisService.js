const { cacheData, getCachedData, deleteCache, keyExists, clearCache } = require("../services/redisService");

module.exports = {
  cacheData: jest.fn(),
  getCachedData: jest.fn(),
  deleteCache: jest.fn(),
  keyExists: jest.fn(),
  clearCache: jest.fn()
};
