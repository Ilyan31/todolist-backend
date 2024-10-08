import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Connexion au pool MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Fonction pour exécuter une requête SQL
export const query = async (sql: string, values?: any) => {
  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    throw error;
  }
};
