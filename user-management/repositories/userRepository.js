const IUserRepository = require('./IRepository/IUserRepository.js');
const User = require('../models/user'); // Ensure this path is correct

/**
 * @implements {IUserRepository}
 */
class UserRepository extends IUserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: [
        "id", 
        "username", 
        "email",  
        "firstName", 
        "middleName", 
        "lastName", 
        "address", 
        "phoneNumber", 
        "accountStatus"
      ],
    });
  }

  async getUserById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }
  
  async getUserByEmail(email) {
    return await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    });
  }
  
  async updateUser(id, userData) {
    return await User.update(userData, {
      where: { id }
    });
  }

  async deleteUser(id) {
    return await User.destroy({
      where: { id }
    });
  }
}

module.exports = new UserRepository();