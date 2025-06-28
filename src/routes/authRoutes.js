// Import necessary modules
import express from "express";
import jwt from "jsonwebtoken";
import sqlDb from "../db.js";
import bcrypt from "bcrypt";
import prisma from "../prismaClient.js";

// Create a router instance
const router = express.Router();

// Register a user when the /register endpoint is hit
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Encrypt the password using bcrypt
  const hashPassword = bcrypt.hashSync(password, 13);

  // Save new user data in the SQLite database
  try {
    // Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
      },
    });

    // Create a default todo for the new user
    const defaultTodo = `Hello :) Create your first todo!`;
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });

    // Create a JWT token for the user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    // Log error response to the console and notify user
    console.log("Error saving user data:", error);
    res.status(503).json({
      message: "Error saving user data. Please try again.",
    });
  }
});

// Login a user when the /login endpoint is hit
router.post("/login", async (req, res) => {
  try {
    // Check if the request body contains username and password
    const { username, password } = req.body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).send({
        message: "User does not exist. Please register first.",
      });
    }

    // Check that the password is valid
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).send({
        message: "Password is incorrect. Please try again.",
      });
    }
    console.log(user);

    // Create a JWT token for the user
    // The token will contain the user's ID and will expire in 24 hours
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    // Send the token back to the client
    res.json({ token });
  } catch (error) {
    // Log error response to the console and notify user
    console.log(error.message);
    res.status(503).json({
      message: "Error logging in. Please try again.",
    });
  }
});

export default router;
