/**
 * @interface IUserRepository
 */
class IUserRepository {
  /**
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  createUser(userData) {}

  /**
   * @returns {Promise<Object[]>}
   */
  getAllUsers() {}

  /**
   * @param {string} id
   * @returns {Promise<Object>}
   */
  getUserById(id) {}

  /**
   * @param {string[]} ids
   * @returns {Promise<Object[]>}
   * */
  getUsersByIds(ids) {}

  /**
   * @param {string} id
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  updateUser(id, userData) {}

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  deleteUser(id) {}
}

module.exports = IUserRepository;
