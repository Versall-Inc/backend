const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  // Hash the password before saving the user
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  return await userRepository.createUser(userData);
};
const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

const getUserById = async (id, includePassword = false) => {
  return await userRepository.getUserById(id, includePassword);
};

const getUsersByIds = async (ids) => {
  return await userRepository.getUsersByIds(ids);
};

const updateUser = async (id, userData) => {
  return await userRepository.updateUser(id, userData);
};

const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

const changePassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await userRepository.updateUser(id, { password: hashedPassword });
};
const getUserByEmail = async (email) => {
  return await userRepository.getUserByEmail(email);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getUserByEmail,
  getUsersByIds,
};
