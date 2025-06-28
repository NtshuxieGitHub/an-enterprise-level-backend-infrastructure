import express from "express";
import sqlDb from "../db.js";

const router = express.Router();

// Get all todos when the /todos endpoint is hit
router.get("/", (req, res) => {
  try {
    // Prepare the SQL statement to select all todos for the user
    const fetchAllTodos = sqlDb.prepare(`
            SELECT * FROM todos where user_id = ?`);
    const todos = fetchAllTodos.all(req.userId);

    // Send the todos as a JSON response
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(503).json({ error: "Internal server error" });
  }
});

// Create a new todo when the /todos endpoint is hit
router.post("/", (req, res) => {
  try {
    // Check if the request body contains task
    const { task } = req.body;

    // Prepare the SQL statement to insert a new todo
    const addNewTodo = sqlDb.prepare(`
      INSERT INTO todos (user_id, task) VALUES (?, ?)
      `);

    // Execute the SQL statement with the provided user ID and task
    const result = addNewTodo.run(req.userId, task);

    // Send the new todo as a JSON response
    res.json({ id: result.lastInsertRowid, task, completed: 0 });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(503).json({ error: "Internal server error" });
  }
});

// Update an existing todo when the /todos/:id endpoint is hit - reference the id
router.put("/:id", (req, res) => {
  try {
    // Check if the request body contains completed
    const { completed, task } = req.body;
    const { id } = req.params;

    // Collect fields to update
    const fields = [];
    const values = [];

    // Push the field and value to the arrays if completed is defined
    if (completed !== undefined) {
      fields.push("completed = ?");
      values.push(completed);
    }

    // Push the field and value to the arrays if task is defined
    if (task !== undefined) {
      fields.push("task = ?");
      values.push(task);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Add id is the last value
    values.push(id);

    // Prepare the SQL statement to update a todo
    const sqlQuery = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;
    const updateTodo = sqlDb.prepare(sqlQuery);

    // Execute the SQL statement with the provided completed and id
    updateTodo.run(...values);

    // Send the updated todo as a JSON response
    res.json({ message: "Todo updated" });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(503).json({ error: "Internal server error" });
  }
});

// Delete a todo when the /todos/:id endpoint is hit - reference the id
router.delete("/:id", (req, res) => {
  try {
    // Destricture the id from request parameters
    const { id } = req.params;
    const { userId } = req;

    // Prepare the SQL statement to delete a todo
    /* 
    this works fine but only checks the task id and does not check
     the user id - need to be able to check both for an added layer 
     of security
    */
    // const deleteTodo = sqlDb.prepare(`
    //   DELETE FROM todos WHERE id = ?
    //   `);

    // // Execute the SQL statement with the provided id
    // deleteTodo.run(id);

    // Prepare the SQL statement to delete a todo
    const deleteTodo = sqlDb.prepare(`
      DELETE FROM todos WHERE id = ? AND user_id = ?
      `);

    // Execute the SQL statement with the provided id
    deleteTodo.run(id, userId);

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
