const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient;
let redisClient;
let db;

// Fonction pour connecter à MongoDB
async function connectMongo() {
  try {
    mongoClient = new MongoClient(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log(`Connected to MongoDB database: ${config.mongodb.dbName}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Arrête l'application en cas d'erreur
  }
}

// Fonction pour connecter à Redis
async function connectRedis() {
  try {
    redisClient = redis.createClient({ url: config.redis.uri });
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1); // Arrête l'application en cas d'erreur
  }
}

// Fonction pour fermer proprement les connexions
async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing connections:', error);
  }
}

// Export des fonctions et clients utiles
module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getMongoDB: () => db, // Accès à la base MongoDB
  getRedisClient: () => redisClient // Accès au client Redis
};
