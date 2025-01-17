const IUserRepository = require("./IRepository/IUserRepository.js");
const User = require("../models/user");

/**
 * @implements {IUserRepository}
 */
class UserRepository extends IUserRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await User.findAll({
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  async getUsersByIds(ids) {
    try {
      return await User.findAll({
        where: {
          id: ids,
        },
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      throw error;
    }
  }

  async getUserById(id, includePassword) {
    try {
      if (includePassword) {
        return await User.findByPk(id);
      }
      return await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      return await User.findOne({
        where: { email },
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const [updated] = await User.update(userData, {
        where: { id },
      });
      if (updated) {
        return await User.findByPk(id, {
          attributes: { exclude: ["password"] },
        });
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  async deleteUser(id) {
    try {
      const deleted = await User.destroy({
        where: { id },
      });
      if (deleted) {
        return { message: "User deleted successfully" };
      }
      throw new Error("User not found");
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
