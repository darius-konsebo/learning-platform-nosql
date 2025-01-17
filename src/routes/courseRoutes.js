const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse); // Créer un cours
router.get('/:id', courseController.getCourse); // Récupérer un cours par ID
router.get('/stats', courseController.getCourseStats); // Obtenir des statistiques
router.put('/:id', courseController.updateCourse); // Mettre à jour un cours
router.delete('/:id', courseController.deleteCourse); // Supprimer un cours

module.exports = router;
