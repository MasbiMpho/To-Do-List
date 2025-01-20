const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file for storing tasks
const filePath = path.join(__dirname, 'tasks.json');

// Function to read tasks from the JSON file
const readTasks = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return an empty array if the file doesn't exist or is empty
  }
};

// Function to save tasks to the JSON file
const saveTasks = (tasks) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Error saving tasks:', err);
  }
};

// Routes
app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    text: req.body.text,
    completed: req.body.completed || false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    task.completed = req.body.completed;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(task => task.id !== req.params.id);
  saveTasks(tasks);
  res.json({ message: 'Task deleted' });
});

// Serve static files (HTML, CSS, JS) from the 'docs' folder
app.use(express.static(path.join(__dirname, 'docs')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
