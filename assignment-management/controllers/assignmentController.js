// controllers/assignmentController.js
const assignmentService = require("../services/assignmentService");

const createAssignment = async (req, res) => {
  const { courseId, title, description, dueDate } = req.body;
  try {
    const assignment = await assignmentService.create(
      courseId,
      title,
      description,
      dueDate
    );
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const assignments = await assignmentService.getByCourseId(courseId);
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;
  try {
    const updatedAssignment = await assignmentService.update(
      id,
      title,
      description,
      dueDate
    );
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    await assignmentService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
  updateAssignment,
  deleteAssignment,
};
