module.exports = {
    // Simule la mise en cache des données
    cacheData: jest.fn().mockResolvedValue(undefined), // Pas de valeur spécifique à retourner
  
    // Simule la récupération des données mises en cache
    getCachedData: jest.fn().mockResolvedValue(null), // Retourne null par défaut, simule une clé manquante
  
    // Simule la suppression des données du cache
    deleteCachedData: jest.fn().mockResolvedValue(undefined), // Pas de valeur spécifique à retourner
  
    // Optionnel: Vérifier si une clé existe dans le cache
    keyExists: jest.fn().mockResolvedValue(false), // Par défaut, la clé n'existe pas
  };
  