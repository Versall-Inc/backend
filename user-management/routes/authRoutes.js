const express = require("express");
const {
  register,
  login,
  completeProfile,
  getMe,
} = require("../controllers/authController");
const validate = require("../middlewares/validate");
const {
  registrationSchema,
  profileCompletionSchema,
} = require("../schemas/userSchemas");
const userMiddleware = require("../middlewares/userMiddleware");

const router = express.Router();

router.post("/register", validate(registrationSchema), register);
router.post("/login", login);
router.post(
  "/complete-profile",
  userMiddleware,
  validate(profileCompletionSchema),
  completeProfile
);
router.get("/me", userMiddleware, getMe);

module.exports = router;
