// models/assignmentModel.js
const pool = require("../config/db");

const createAssignment = async (courseId, title, description, dueDate) => {
  const query = `
    INSERT INTO assignments (course_id, title, description, due_date)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [courseId, title, description, dueDate];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAssignmentsByCourseId = async (courseId) => {
  const query = `SELECT * FROM assignments WHERE course_id = $1;`;
  const result = await pool.query(query, [courseId]);
  return result.rows;
};

const updateAssignment = async (id, title, description, dueDate) => {
  const query = `
    UPDATE assignments
    SET title = $1, description = $2, due_date = $3
    WHERE id = $4 RETURNING *;
  `;
  const values = [title, description, dueDate, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteAssignment = async (id) => {
  const query = `DELETE FROM assignments WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createAssignment,
  getAssignmentsByCourseId,
  updateAssignment,
  deleteAssignment,
};
