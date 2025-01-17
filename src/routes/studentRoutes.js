const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Routes pour les étudiants
router.post('/', studentController.createStudent); // Créer un étudiant
router.get('/:id', studentController.getStudent); // Récupérer un étudiant par ID
router.get('/stats', studentController.getStudentStats); // Obtenir des statistiques
router.put('/:id', studentController.updateStudent); // Mettre à jour un étudiant
router.delete('/:id', studentController.deleteStudent); // Supprimer un étudiant

module.exports = router;
