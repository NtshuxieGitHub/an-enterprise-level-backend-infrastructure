// Import necessary modules
import express from "express";
import jwt from "jsonwebtoken";
import sqlDb from "../db.js";
import bcrypt from "bcrypt";

// Create a router instance
const router = express.Router();

// Register a user when the /register endpoint is hit
router.post("/register", (req, res) => {
  console.log("Incoming body (register):", req.body);

  const { username, password } = req.body;

  // Encrypt the password using bcrypt
  const hashPassword = bcrypt.hashSync(password, 13);

  // Save new user data in the SQLite database
  try {
    // Prepare the SQL statement to insert user data
    const insertUserData = sqlDb.prepare(`
        INSERT INTO users (username, password) VALUES (?, ?)
        `);

    // Execute the SQL statement with the provided username and hashed password
    const result = insertUserData.run(username, hashPassword);

    // Create a default todo for the new user
    const defaultTodo = `Hello :) Create your first todo!`;
    const insertDefaultTodo = sqlDb.prepare(
      `
            INSERT INTO todos (user_id, task) VALUES (?, ?)
            `
    );

    // Use last insert row id and default todo to insert into todos table
    insertDefaultTodo.run(result.lastInsertRowid, defaultTodo);

    // Create a JWT token for the user
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

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
router.post("/login", (req, res) => {
  try {
    // Check if the request body contains username and password
    const { username, password } = req.body;

    // Prepare the SQL statement to select user data
    const fetchUserData = sqlDb.prepare(`
      SELECT * FROM users WHERE username = ?
      `);
    const user = fetchUserData.get(username);

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
