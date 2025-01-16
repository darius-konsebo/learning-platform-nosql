const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Les variables d'environnement suivantes sont manquantes : ${missingVars.join(', ')}`);
  }
}

// Appel de la validation au démarrage
try {
  validateEnv();
  console.log('Toutes les variables d’environnement requises sont définies.');
} catch (error) {
  console.error(error.message);
  process.exit(1); // Arrête l'application en cas de variables manquantes
}

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};
