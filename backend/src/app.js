import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Add a user
app.post("/adduser", async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    res.json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add user" });
  }
});

// Get all users
app.get("/getusers", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update a user
app.patch("/updateuser/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const fields = [];
  const values = [];

  if (username !== undefined) {
    fields.push(`username = $${fields.length + 1}`);
    values.push(username);
  }
  if (password !== undefined) {
    fields.push(`password = $${fields.length + 1}`);
    values.push(password);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(id);

  try {
    await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${values.length}`,
      values,
    );
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Delete a user
app.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export { app };
