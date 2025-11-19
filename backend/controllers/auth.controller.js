const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../config/dataBase");
const { enviarRecuperacionPassword } = require("../service/email.service");

dotenv.config();

// 📌 1) Solicitar recuperación
const solicitarReset = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, email FROM usuarios WHERE email = ?",
      [email]
    );

    const usuario = rows[0];

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        mail: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Crear link después del token
    const link = `http://localhost:5173/reset-password?token=${token}`;
    console.log("Link de recuperación:", link);

    await enviarRecuperacionPassword(usuario.email, link);

    res.status(200).json({ message: "Email de recuperación enviado" });

  } catch (error) {
    console.error("Error en solicitarReset:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


// 📌 2) Resetear contraseña
const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { nuevaPassword, confirmarPassword } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token no proporcionado" });
    }

    if (nuevaPassword !== confirmarPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query(
      "UPDATE usuarios SET password = ? WHERE id = ?",
      [nuevaPassword, decoded.id]
    );

    return res.status(200).json({ message: "Contraseña restablecida correctamente" });

  } catch (error) {
    console.error("Error en resetPassword:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { solicitarReset, resetPassword };
