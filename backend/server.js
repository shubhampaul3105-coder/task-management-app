const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.json({ message: "Task Management API is running" });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title, description = "", priority = "Medium", dueDate = "" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    description,
    priority,
    dueDate,
    status: "Pending"
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(item => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  Object.assign(task, req.body);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(item => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});