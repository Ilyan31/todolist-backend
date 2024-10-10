import express from 'express';
import { db } from './db'; // Importer la connexion à la base de données

const app = express();
const port = 3000;

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de la TodoList !');
});

// Route pour récupérer les tâches
app.get('/todos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM todos'); // Remplace 'todos' par le nom de ta table
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});