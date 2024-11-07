import express, { json } from "express";
import { readFile, writeFile } from "fs/promises";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000; 


app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Welcome to the User API!");
});


app.post("/api/users", async (req, res) => {
  const userData = req.body;

  try {
    const data = await readFile("users.json", "utf-8");
    const users = data.length ? JSON.parse(data) : [];
    users.push(userData);

    await writeFile("users.json", JSON.stringify(users, null, 2));
    res.status(201).json({ message: "User data saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing request." });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const data = await readFile("users.json", "utf-8");
    const users = data.length ? JSON.parse(data) : [];
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users." });
  }
});


app.get("/api/users/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const data = await readFile("users.json", "utf-8");
    const users = data.length ? JSON.parse(data) : [];

    
    const user = users.find((user) => user.uid === uid);

    if (user) {
      res.status(200).json(user); 
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data." });
  }
});

app.put("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  const updatedPassword = req.body.password;

  try {
    const data = await readFile("users.json", "utf-8");
    const users = data.length ? JSON.parse(data) : [];

    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex !== -1) {
      users[userIndex].password = updatedPassword;
      await writeFile("users.json", JSON.stringify(users, null, 2));
      res.status(200).json({ message: "User password updated successfully!" });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user." });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
