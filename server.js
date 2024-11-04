import express, { json } from 'express';
import { readFile, writeFile } from 'fs/promises';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000; // Make sure to use 3000 if that's what you prefer

// Middleware
app.use(cors());
app.use(json());

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the User API!');
});

// Endpoint to save user data
app.post('/api/users', async (req, res) => {
  const userData = req.body;

  try {
    const data = await readFile('users.json', 'utf-8');
    const users = data.length ? JSON.parse(data) : [];
    users.push(userData);

    await writeFile('users.json', JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'User data saved successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
