const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

// Créer un étudiant
async function createStudent(req, res) {
  try {
    const studentData = req.body;

    if (!studentData || !studentData.name || !studentData.email) {
      return res.status(400).json({ error: 'Les champs "name" et "email" sont obligatoires.' });
    }

    const insertedStudent = await mongoService.insertOne('students', studentData);
    await redisService.cacheData(`student:${insertedStudent._id}`, insertedStudent, 3600);

    return res.status(201).json({ message: 'Étudiant créé avec succès.', student: insertedStudent });
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Récupérer un étudiant par ID
async function getStudent(req, res) {
  try {
    const studentId = req.params.id;

    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'ID d\'étudiant invalide.' });
    }

    // Vérifier dans le cache Redis
    const cachedStudent = await redisService.getData(`student:${studentId}`);
    if (cachedStudent) {
      return res.status(200).json({ student: cachedStudent, source: 'cache' });
    }

    // Sinon, chercher dans MongoDB
    const student = await mongoService.findOneById('students', studentId);
    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé.' });
    }

    // Mettre en cache pour des requêtes futures
    await redisService.cacheData(`student:${studentId}`, student, 3600);

    return res.status(200).json({ student });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Mettre à jour un étudiant par ID
async function updateStudent(req, res) {
  try {
    const studentId = req.params.id;
    const updates = req.body;

    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'ID d\'étudiant invalide.' });
    }

    const updatedStudent = await mongoService.updateOne('students', { _id: new ObjectId(studentId) }, { $set: updates });
    if (!updatedStudent.matchedCount) {
      return res.status(404).json({ error: 'Étudiant non trouvé.' });
    }

    // Invalider le cache Redis
    await redisService.deleteData(`student:${studentId}`);

    return res.status(200).json({ message: 'Étudiant mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étudiant :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Supprimer un étudiant par ID
async function deleteStudent(req, res) {
  try {
    const studentId = req.params.id;

    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'ID d\'étudiant invalide.' });
    }

    const deletedStudent = await mongoService.deleteOne('students', { _id: new ObjectId(studentId) });
    if (!deletedStudent.deletedCount) {
      return res.status(404).json({ error: 'Étudiant non trouvé.' });
    }

    // Supprimer du cache Redis
    await redisService.deleteData(`student:${studentId}`);

    return res.status(200).json({ message: 'Étudiant supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Obtenir les statistiques des étudiants
async function getStudentStats(req, res) {
  try {
    const stats = await mongoService.aggregate('students', [
      { $group: { _id: null, totalStudents: { $sum: 1 } } }
    ]);

    return res.status(200).json({ stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
}

// Export des contrôleurs
module.exports = {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
};
