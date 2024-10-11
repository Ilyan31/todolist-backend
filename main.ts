import express from 'express';
import authRouter from './auth'; // Importer les routes d'authentification
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Pour pouvoir lire le JSON dans les requêtes

// Utiliser les routes d'authentification
app.use('/auth', authRouter);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});