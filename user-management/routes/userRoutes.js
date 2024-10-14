const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const userSchema = require('../schemas/userSchema');
const authMiddleware = require('../middlewares/authMiddleware'); // Import authMiddleware

router.post('/', validate(userSchema), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware, validate(userSchema), userController.updateUser); // Apply authMiddleware
router.delete('/:id', authMiddleware, userController.deleteUser); // Apply authMiddleware

module.exports = router;