const studentController = require('../controllers/studentController');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const { ObjectId } = require('mongodb');

jest.mock('../services/mongoService');
jest.mock('../services/redisService');

describe('Student Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Nettoyer les mocks après chaque test
  });

  describe('createStudent', () => {
    it('should create a student and cache it', async () => {
      const req = {
        body: { name: 'John Doe', email: 'john.doe@example.com', birthdate: '2000-01-01' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const student = { ...req.body };

      mongoService.insertOne.mockResolvedValue(student);
      redisService.cacheData.mockResolvedValue(true);

      await studentController.createStudent(req, res);

      expect(mongoService.insertOne).toHaveBeenCalledWith('students', req.body);
      expect(redisService.cacheData).toHaveBeenCalledWith(`student:${student._id}`, student, 3600);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(student);
    });

    it('should return 400 if required fields are missing', async () => {
      const req = { body: { name: '', email: '', birthdate: '' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Tous les champs sont requis : name, email, et birthdate',
      });
    });
  });

  describe('getAllStudents', () => {
    it('should return all students with their age calculated', async () => {
      const students = [
        { name: 'John Doe', email: 'john@example.com', birthdate: '2000-01-01' },
        { name: 'Jane Doe', email: 'jane@example.com', birthdate: '1995-01-01' },
      ];
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoService.getAll.mockResolvedValue(students);

      await studentController.getAllStudents(req, res);

      expect(mongoService.getAll).toHaveBeenCalledWith('students');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'John Doe',
            age: expect.any(Number),
          }),
        ])
      );
    });
  });

  describe('getStudentById', () => {
    it('should return a student from cache if available', async () => {
       const id = '678af5546f44908fef5c44d8';
      const student = { _id: id, name: 'John Doe', birthdate: '2000-01-01' };
      const req = { params: { id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      redisService.getCachedData.mockResolvedValue(JSON.stringify(student));

      await studentController.getStudentById(req, res);

      expect(redisService.getCachedData).toHaveBeenCalledWith(`student:${id}`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' }));
    });

    it('should return 404 if the student is not found in DB', async () => {
      const id = '678af5546f44908fef5c44d8';
      const req = { params: { id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      redisService.getCachedData.mockResolvedValue(null);
      mongoService.findOneById.mockResolvedValue(null);

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Étudiant non trouvé' });
    });
  });

  describe('updateStudent', () => {
    it('should update a student and refresh the cache', async () => {
      const id = '678af5546f44908fef5c44d8';
      const req = {
        params: { id },
        body: { name: 'Updated Name', email: 'updated@example.com', birthdate: '2001-01-01' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const updatedStudent = { _id: id, ...req.body };

      mongoService.updateOneById.mockResolvedValue(updatedStudent);
      redisService.cacheData.mockResolvedValue(true);

      await studentController.updateStudent(req, res);

      expect(mongoService.updateOneById).toHaveBeenCalledWith('students', id, req.body);
      expect(redisService.cacheData).toHaveBeenCalledWith(`student:${id}`, updatedStudent, 3600);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedStudent);
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student and remove them from cache', async () => {
      const id = '678af5514be945372afa4cc8';
      const req = { params: { id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoService.deleteOneById.mockResolvedValue(true);
      redisService.deleteCache.mockResolvedValue(true);

      await studentController.deleteStudent(req, res);

      expect(mongoService.deleteOneById).toHaveBeenCalledWith('students', id);
      expect(redisService.deleteCache).toHaveBeenCalledWith(`student:${id}`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Étudiant supprimé avec succès' });
    });

    it('should return 404 if the student is not found during deletion', async () => {
      const id = '678af5514be945372afa4cc8';
      const req = { params: { id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoService.deleteOneById.mockResolvedValue(null);

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Étudiant non trouvé' });
    });
  });
});
