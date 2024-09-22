"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @interface IUserRepository
 */
var IUserRepository =
/*#__PURE__*/
function () {
  function IUserRepository() {
    _classCallCheck(this, IUserRepository);
  }

  _createClass(IUserRepository, [{
    key: "createUser",

    /**
     * @param {Object} userData
     * @returns {Promise<Object>}
     */
    value: function createUser(userData) {}
    /**
     * @returns {Promise<Object[]>}
     */

  }, {
    key: "getAllUsers",
    value: function getAllUsers() {}
    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */

  }, {
    key: "getUserById",
    value: function getUserById(id) {}
    /**
     * @param {string} id
     * @param {Object} userData
     * @returns {Promise<Object>}
     */

  }, {
    key: "updateUser",
    value: function updateUser(id, userData) {}
    /**
     * @param {string} id
     * @returns {Promise<void>}
     */

  }, {
    key: "deleteUser",
    value: function deleteUser(id) {}
  }]);

  return IUserRepository;
}();

module.exports = IUserRepository;