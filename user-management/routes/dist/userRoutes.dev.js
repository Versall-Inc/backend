"use strict";

var express = require('express');

var router = express.Router();

var userController = require('../controllers/userController');

var validate = require('../middlewares/validate');

var userSchema = require('../schemas/userSchema');

var authMiddleware = require('../middlewares/authMiddleware'); // Import authMiddleware


router.post('/', validate(userSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware, validate(userSchema), userController.updateUser); // Apply authMiddleware

router["delete"]('/:id', authMiddleware, userController.deleteUser); // Apply authMiddleware

module.exports = router;