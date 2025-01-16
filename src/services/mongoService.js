
const { ObjectId } = require('mongodb');

/**
 * Rechercher un document par ID dans une collection MongoDB.
 * @param {Object} collection - La collection MongoDB où effectuer la recherche.
 * @param {string} id - L'ID du document à rechercher.
 * @returns {Promise<Object|null>} - Retourne le document trouvé ou null s'il n'existe pas.
 */
async function findOneById(collection, id) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
    const objectId = new ObjectId(id);
    const document = await collection.findOne({ _id: objectId });
    return document;
  } catch (error) {
    console.error('Error in findOneById:', error);
    throw error;
  }
}

/**
 * Insérer un document dans une collection MongoDB.
 * @param {Object} collection - La collection MongoDB où insérer le document.
 * @param {Object} document - Le document à insérer.
 * @returns {Promise<Object>} - Retourne le résultat de l'opération d'insertion.
 */
async function insertOne(collection, document) {
  try {
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    console.error('Error in insertOne:', error);
    throw error;
  }
}

/**
 * Mettre à jour un document dans une collection MongoDB.
 * @param {Object} collection - La collection MongoDB où effectuer la mise à jour.
 * @param {string} id - L'ID du document à mettre à jour.
 * @param {Object} update - Les champs à mettre à jour.
 * @returns {Promise<Object>} - Retourne le résultat de l'opération de mise à jour.
 */
async function updateOneById(collection, id, update) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
    const objectId = new ObjectId(id);
    const result = await collection.updateOne({ _id: objectId }, { $set: update });
    return result;
  } catch (error) {
    console.error('Error in updateOneById:', error);
    throw error;
  }
}

/**
 * Supprimer un document par ID dans une collection MongoDB.
 * @param {Object} collection - La collection MongoDB où effectuer la suppression.
 * @param {string} id - L'ID du document à supprimer.
 * @returns {Promise<Object>} - Retourne le résultat de l'opération de suppression.
 */
async function deleteOneById(collection, id) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId: ${id}`);
    }
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });
    return result;
  } catch (error) {
    console.error('Error in deleteOneById:', error);
    throw error;
  }
}

// Export des services
module.exports = {
  findOneById,
  insertOne,
  updateOneById,
  deleteOneById
};
