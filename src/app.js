
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    console.log('Connecting to databases...');
    await db.connectMongo();
    await db.connectRedis();
    console.log('Databases connected successfully.');

    // Configurer les middlewares Express
    console.log('Configuring middlewares...');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Monter les routes
    console.log('Mounting routes...');
    app.use('/api/courses', courseRoutes);
    app.use('/api/students', studentRoutes);

    // Démarrer le serveur
    const port = config.port;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Arrêt du processus en cas d'échec critique
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  try {
    console.log('SIGTERM received. Closing connections...');
    await db.closeMongo();
    await db.closeRedis();
    console.log('Connections closed. Exiting process.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();
