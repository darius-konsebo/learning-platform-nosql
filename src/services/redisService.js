
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

/**
 * Mettre en cache des données dans Redis.
 * @param {string} key - La clé pour identifier les données dans Redis.
 * @param {Object} data - Les données à mettre en cache.
 * @param {number} ttl - Durée de vie en secondes avant expiration des données.
 */
async function cacheData(key, data, ttl) {
  try {
    const serializedData = JSON.stringify(data);
    await client.setEx(key, ttl, serializedData);
    console.log(`Data cached with key: ${key}`);
  } catch (error) {
    console.error('Error caching data:', error);
    throw error;
  }
}

/**
 * Récupérer des données mises en cache dans Redis.
 * @param {string} key - La clé des données à récupérer.
 * @returns {Promise<Object|null>} - Les données récupérées ou null si la clé n'existe pas.
 */
async function getCachedData(key) {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    throw error;
  }
}

/**
 * Supprimer des données du cache Redis.
 * @param {string} key - La clé des données à supprimer.
 */
async function deleteCachedData(key) {
  try {
    await client.del(key);
    console.log(`Cache deleted for key: ${key}`);
  } catch (error) {
    console.error('Error deleting cached data:', error);
    throw error;
  }
}

/**
 * Vérifier si une clé existe dans Redis.
 * @param {string} key - La clé à vérifier.
 * @returns {Promise<boolean>} - True si la clé existe, sinon false.
 */
async function keyExists(key) {
  try {
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Error checking key existence:', error);
    throw error;
  }
}

// Export des fonctions utilitaires
module.exports = {
  cacheData,
  getCachedData,
  deleteCachedData,
  keyExists
};
