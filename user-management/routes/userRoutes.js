const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validate = require("../middlewares/validate");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../schemas/userSchemas");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/", validate(updateProfileSchema), userController.updateUser);
router.put(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword
);
router.delete("/", userController.deleteUser);

module.exports = router;
