const { findOneById, insertOne, updateOneById, deleteOneById, getTotalCount, getAverageField, getAll, aggregate } = require("../services/mongoService");

module.exports = {
  findOneById: jest.fn(),
  insertOne: jest.fn(),
  updateOneById: jest.fn(),
  deleteOneById: jest.fn(),
  getTotalCount: jest.fn(),
  getAverageField: jest.fn(),
  getAll: jest.fn(),
  aggregate: jest.fn(),
};
