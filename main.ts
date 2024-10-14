import express from 'express';
import { db } from './db'; // Importer la connexion à la base de données
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const secret = 'secret_key'; // Utiliser une clé secrète pour JWT

app.use(bodyParser.json()); // Pour lire le JSON

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de la TodoList !');
});

// Route pour récupérer les tâches
app.get('/todos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM todos');
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour l'inscription
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existingUser]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

// Route pour la connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [user]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user.length === 0) {
      return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
    const token = jwt.sign({ userId: user[0].id }, secret, { expiresIn: '1h' });
    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});