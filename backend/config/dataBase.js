// Importamos la versión de mysql2 que soporta promesas
const mysql = require("mysql2/promise");

// Creamos un pool de conexiones
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mamaypapalosamo",        // tu contraseña
  database: "merceria",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
