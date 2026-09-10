const express = require("express");
const pool = require("../config/db.js");
const { protect } = require("../middleware/auth.js");

const router = express.Router();

// create a todo for logged-in user
router.post('/todos', protect, async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description, user_id) VALUES($1, $2) RETURNING *",
      [description, req.user.id]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// get all todos for logged-in user
router.get("/todos", protect, async (req, res) => {
  try {
    const userTodos = await pool.query(
      "SELECT * FROM todo WHERE user_id = $1 ORDER BY todo_id ASC",
      [req.user.id]
    );
    res.json(userTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// get a single todo for logged-in user
router.get("/todos/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (todo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// update a todo for logged-in user
router.put("/todos/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2 AND user_id = $3",
      [description, id, req.user.id]
    );
    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// delete a todo for logged-in user
router.delete("/todos/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
