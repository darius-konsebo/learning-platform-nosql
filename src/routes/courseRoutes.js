// Import du router express
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
// Création
router.post('/', courseController.createCourse); // Créer un cours

// Lecture
router.get('/', courseController.getAllCourses); // Récupérer tous les cours
router.get('/stats', courseController.getCourseStats); // Obtenir des statistiques sur les cours
router.get('/:id', courseController.getCourseById); // Récupérer un cours spécifique

// Mise à jour
router.put('/:id', courseController.updateCourse); // Mettre à jour un cours

// Suppression
router.delete('/:id', courseController.deleteCourse); // Supprimer un cours

// Export du module de routes
module.exports = router;
