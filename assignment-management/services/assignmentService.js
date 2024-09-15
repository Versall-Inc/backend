// services/assignmentService.js
const {
  createAssignment,
  getAssignmentsByCourseId,
  updateAssignment,
  deleteAssignment,
} = require("../models/assignmentModel");
const { getCache, setCache } = require("./cacheService");

const create = async (courseId, title, description, dueDate) => {
  return await createAssignment(courseId, title, description, dueDate);
};

const getByCourseId = async (courseId) => {
  const cacheKey = `course_${courseId}_assignments`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const assignments = await getAssignmentsByCourseId(courseId);
  setCache(cacheKey, assignments);
  return assignments;
};

const update = async (id, title, description, dueDate) => {
  return await updateAssignment(id, title, description, dueDate);
};

const remove = async (id) => {
  return await deleteAssignment(id);
};

module.exports = {
  create,
  getByCourseId,
  update,
  remove,
};
