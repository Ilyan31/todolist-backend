import mysql from 'mysql2';

// Configurer la connexion via le socket UNIX
const pool = mysql.createPool({
  socketPath: '/var/run/mysqld/mysqld.sock', // Chemin correct du socket MySQL
  user: 'root',                             // Utilisateur MySQL
  password: 'mot-de-passe',                 // Mot de passe MySQL
  database: 'Projet ToDoList',              // Nom de la base de données
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = pool.promise();