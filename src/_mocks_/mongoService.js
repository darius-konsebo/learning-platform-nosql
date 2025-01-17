module.exports = {
    // Simuler l'insertion d'un document dans une collection MongoDB
    insertOne: jest.fn().mockResolvedValue({
      insertedId: 'some-inserted-id',  // Retourne un id d'insertion simulé
    }),
  
    // Simuler la recherche d'un document par ID
    findOneById: jest.fn().mockResolvedValue(null),  // Retourne null par défaut (cas où le document n'est pas trouvé)
  
    // Simuler la mise à jour d'un document par ID
    updateOneById: jest.fn().mockResolvedValue({
      matchedCount: 1,  // Le nombre de documents trouvés et mis à jour
      modifiedCount: 1, // Le nombre de documents réellement modifiés
    }),
  
    // Simuler la suppression d'un document par ID
    deleteOneById: jest.fn().mockResolvedValue({
      deletedCount: 1, // Nombre de documents supprimés
    }),
  
  };
  