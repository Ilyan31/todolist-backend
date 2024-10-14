import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';

const router = express.Router();
const secret = 'secret_key'; // Stocker cette clé dans une variable d'environnement

// Route pour l'inscription
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Utilisateur existant' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne' });
  }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user.length === 0) {
      return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect' });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Identifiant ou mot de passe incorrect' });
    }
    const token = jwt.sign({ userId: user[0].id }, secret, { expiresIn: '1h' });
    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne' });
  }
});

export default router;