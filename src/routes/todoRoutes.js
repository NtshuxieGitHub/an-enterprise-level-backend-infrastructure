import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos when the /todos endpoint is hit
router.get("/", async (req, res) => {
  // Get all todos for the user id
  try {
    const todos = await prisma.todos.findMany({
      where: {
        userId: req.userId,
      },
    });

    // Send the todos as a JSON response
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(503).json({ error: "Internal server error" });
  }
});

// Create a new todo when the /todos endpoint is hit
router.post("/", async (req, res) => {
  try {
    // Check if the request body contains task
    const { task } = req.body;

    // Save new todo data in the SQLite database
    const todo = await prisma.todo.create({
      data: {
        task,
        userId: req.userId,
      },
    });

    // Send the new todo as a JSON response
    res.json(todo);
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(503).json({ error: "Internal server error" });
  }
});

// Update an existing todo when the /todos/:id endpoint is hit - reference the id
router.put("/:id", async (req, res) => {
  try {
    // Check if the request body contains completed
    const { completed, task } = req.body;
    const { id } = req.params;

    // Dynamicall build data to update
    const dataToUpdate = {};
    if (task !== undefined) dataToUpdate.task = task;
    if (completed !== undefined) dataToUpdate.completed = !!completed;

    // If there are no keys in the dataToUpdate object, return an error
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Check that the user has an existing todo with the provided id
    const existingTodo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // If the todo does not exist, return an error
    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Check that the todo belongs to the user
    if (existingTodo.userId !== req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update the todo
    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });

    // Send the updated todo as a JSON response
    res.json(updatedTodo);
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(503).json({ error: "Internal server error" });
  }
});

// Delete a todo when the /todos/:id endpoint is hit - reference the id
router.delete("/:id", async (req, res) => {
  try {
    // Destricture the id from request parameters
    const { id } = req.params;
    const { userId } = req;

    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    // Send the deleted todo as a JSON response
    res.json({
      message: "Todo deleted",
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(503).json({ error: "Internal server error" });
  }
});

export default router;
