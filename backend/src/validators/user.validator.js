import { body } from "express-validator";

export const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
