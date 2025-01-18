const courseController = require('../controllers/courseController');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

jest.mock('../services/mongoService');
jest.mock('../services/redisService');

describe('Course Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
  });

  describe('createCourse', () => {
    it('should create a new course and cache it in Redis', async () => {
      const req = { body: { name: 'Math 101', duration: '3 months' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      const mockCourse = { _id: 'courseId123', name: 'Math 101', duration: '3 months' };
      mongoService.insertOne.mockResolvedValue(mockCourse);
      redisService.cacheData.mockResolvedValue();

      await courseController.createCourse(req, res);

      expect(mongoService.insertOne).toHaveBeenCalledWith('courses', { name: 'Math 101', duration: '3 months' });
      expect(redisService.cacheData).toHaveBeenCalledWith(`course:${mockCourse._id}`, mockCourse, 3600);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    it('should return 400 if required fields are missing', async () => {
      const req = { body: { name: 'Math 101' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      await courseController.createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required: name and duration' });
    });
  });

  describe('getAllCourses', () => {
    it('should retrieve all courses from the database', async () => {
      const req = {};
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      const mockCourses = [{ name: 'Math 101', duration: '3 months' }];
      mongoService.getAll.mockResolvedValue(mockCourses);

      await courseController.getAllCourses(req, res);

      expect(mongoService.getAll).toHaveBeenCalledWith('courses');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });
  });

  describe('getCourseById', () => {
    it('should retrieve a course by ID from the cache', async () => {
      const req = { params: { id: 'courseId123' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      const mockCourse = { _id: 'courseId123', name: 'Math 101', duration: '3 months' };
      redisService.getCachedData.mockResolvedValue(JSON.stringify(mockCourse));

      await courseController.getCourseById(req, res);

      expect(redisService.getCachedData).toHaveBeenCalledWith('course:courseId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    it('should retrieve a course by ID from the database if not cached', async () => {
      const req = { params: { id: 'courseId123' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      const mockCourse = { _id: 'courseId123', name: 'Math 101', duration: '3 months' };
      redisService.getCachedData.mockResolvedValue(null);
      mongoService.findOneById.mockResolvedValue(mockCourse);

      await courseController.getCourseById(req, res);

      expect(redisService.getCachedData).toHaveBeenCalledWith('course:courseId123');
      expect(mongoService.findOneById).toHaveBeenCalledWith('courses', 'courseId123');
      expect(redisService.cacheData).toHaveBeenCalledWith('course:courseId123', mockCourse, 3600);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    it('should return 404 if course is not found', async () => {
      const req = { params: { id: 'courseId123' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      redisService.getCachedData.mockResolvedValue(null);
      mongoService.findOneById.mockResolvedValue(null);

      await courseController.getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course by ID and clear cache', async () => {
      const req = { params: { id: 'courseId123' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      mongoService.deleteOneById.mockResolvedValue(true);
      redisService.deleteCache.mockResolvedValue();

      await courseController.deleteCourse(req, res);

      expect(mongoService.deleteOneById).toHaveBeenCalledWith('courses', 'courseId123');
      expect(redisService.deleteCache).toHaveBeenCalledWith('course:courseId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Course deleted successfully' });
    });

    it('should return 404 if course to delete is not found', async () => {
      const req = { params: { id: 'courseId123' } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };

      mongoService.deleteOneById.mockResolvedValue(null);

      await courseController.deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
    });
  });
});
