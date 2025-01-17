const studentController = require('../controllers/studentController');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

jest.mock('../services/mongoService');
jest.mock('../services/redisService');

describe('Student Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    it('should create a new student successfully', async () => {
      const req = { body: { name: 'John Doe', email: 'john.doe@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoService.insertOne.mockResolvedValue({ _id: '123', ...req.body });
      redisService.cacheData.mockResolvedValue(true);

      await studentController.createStudent(req, res);

      expect(mongoService.insertOne).toHaveBeenCalledWith('students', req.body);
      expect(redisService.cacheData).toHaveBeenCalledWith(
        'student:123',
        { _id: '123', ...req.body },
        3600
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Étudiant créé avec succès.',
        student: { _id: '123', ...req.body },
      });
    });

    it('should return a 400 error if required fields are missing', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Les champs "name" et "email" sont obligatoires.',
      });
    });
  });

  describe('getStudent', () => {
    it('should retrieve a student from Redis cache if exists', async () => {
        const req = { params: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Si tu veux tester le cas où les données sont en cache
        redisService.getCachedData.mockResolvedValue({ _id: '123', name: 'John Doe', email: 'john.doe@example.com' });
      
        await studentController.getStudent(req, res);
      
        expect(redisService.getCachedData).toHaveBeenCalledWith('student:123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          student: { _id: '123', name: 'John Doe', email: 'john.doe@example.com' },
          source: 'cache',
        });
      });
      
      it('should return null if student is not found in cache', async () => {
        const req = { params: { id: '123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Simuler que les données ne sont pas trouvées dans le cache
        redisService.getCachedData.mockResolvedValue(null);
      
        await studentController.getStudent(req, res);
      
        expect(redisService.getCachedData).toHaveBeenCalledWith('student:123');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Student not found in cache' });
      });
      
  });

  describe('deleteStudent', () => {
    it('should delete a student successfully', async () => {
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoService.deleteOneById.mockResolvedValue({ deletedCount: 1 });
      redisService.deleteCachedData.mockResolvedValue(true);

      await studentController.deleteStudent(req, res);

      expect(mongoService.deleteOneById).toHaveBeenCalledWith('students', '123');
      expect(redisService.deleteCachedData).toHaveBeenCalledWith('student:123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Étudiant supprimé avec succès.',
      });
    });

    it('should return 404 if student not found', async () => {
      const req = { params: { id: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoService.deleteOneById.mockResolvedValue({ deletedCount: 0 });

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Étudiant non trouvé.',
      });
    });
  });
});
