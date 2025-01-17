const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

// Créer un cours
async function createCourse(req, res) {
  try {
    const courseData = req.body;

    if (!courseData || !courseData.title || !courseData.description) {
      return res.status(400).json({ error: 'Les champs "title" et "description" sont obligatoires.' });
    }

    const insertedCourse = await mongoService.insertOne('courses', courseData);
    await redisService.cacheData(`course:${insertedCourse._id}`, insertedCourse, 3600);

    return res.status(201).json({ message: 'Cours créé avec succès.', course: insertedCourse });
  } catch (error) {
    console.error('Erreur lors de la création du cours :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Récupérer un cours par ID
async function getCourse(req, res) {
  try {
    const courseId = req.params.id;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'ID de cours invalide.' });
    }

    // Vérifier dans le cache Redis
    const cachedCourse = await redisService.getData(`course:${courseId}`);
    if (cachedCourse) {
      return res.status(200).json({ course: cachedCourse, source: 'cache' });
    }

    // Sinon, chercher dans MongoDB
    const course = await mongoService.findOneById('courses', courseId);
    if (!course) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Mettre en cache pour des requêtes futures
    await redisService.cacheData(`course:${courseId}`, course, 3600);

    return res.status(200).json({ course });
  } catch (error) {
    console.error('Erreur lors de la récupération du cours :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Mettre à jour un cours par ID
async function updateCourse(req, res) {
  try {
    const courseId = req.params.id;
    const updates = req.body;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'ID de cours invalide.' });
    }

    const updatedCourse = await mongoService.updateOne('courses', { _id: new ObjectId(courseId) }, { $set: updates });
    if (!updatedCourse.matchedCount) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Invalider le cache Redis
    await redisService.deleteData(`course:${courseId}`);

    return res.status(200).json({ message: 'Cours mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Supprimer un cours par ID
async function deleteCourse(req, res) {
  try {
    const courseId = req.params.id;

    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'ID de cours invalide.' });
    }

    const deletedCourse = await mongoService.deleteOne('courses', { _id: new ObjectId(courseId) });
    if (!deletedCourse.deletedCount) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Supprimer du cache Redis
    await redisService.deleteData(`course:${courseId}`);

    return res.status(200).json({ message: 'Cours supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Obtenir les statistiques des cours
async function getCourseStats(req, res) {
  try {
    const stats = await mongoService.aggregate('courses', [
      { $group: { _id: null, totalCourses: { $sum: 1 } } }
    ]);

    return res.status(200).json({ stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Export des contrôleurs
module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
};
