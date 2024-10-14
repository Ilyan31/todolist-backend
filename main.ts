import express, { Request, Response } from "express";
import { query } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { RowDataPacket } from "mysql2";

const app = express();
app.listen(3000, () => console.log("Serveur prêt à démarrer"));
const secret = "secret_key";

app.use(express.json());

// Route pour récupérer toutes les tâches
app.get("/todos",async (req, res) => {
  try {
    const results = query("SELECT * FROM todos");
  res.json(results);
    }catch (error) {
      console.log("Erreur lors de la récupération des tâches",error); // Log l'erreur pour le développement
      return res.status(500).json({ error: "Impossible de récupérer les tâches pour le moment." });
      }
      });

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existingUser]: any = await query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    console.log("Erreur lors de la création de l'utilisateur", error); // Log l'erreur
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la création de l'utilisateur.",
      });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user: any = await query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (user.length === 0) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }
    const token = jwt.sign({ userId: user[0].id }, secret, { expiresIn: "1h" });
    res.json({ message: "Connexion réussie", token });
  } catch (error) {
    console.log("Erreur lors de la connexion", error); // Log l'erreur
    res
      .status(500)
      .json({ error: "Impossible de se connecter pour le moment." });
  }
});
