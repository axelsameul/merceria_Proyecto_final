const pool = require("../config/dataBase");

// Registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // Verificar si ya existe ese email
    const [existe] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existe.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Insertar nuevo usuario
    await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, password, rol || "cliente"]
    );

    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};

// Login de usuario
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // En producción deberías usar bcrypt para comparar contraseñas
    if (password !== usuario.password) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Enviamos los datos del usuario
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol, // 👈 este campo define si es admin o cliente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};
