import { useState } from "react";
import axios from "axios";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/solicitar-reset", {
        email,
      });

      setMensaje("Si existe ese usuario, el correo fue enviado ✔️");
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al enviar solicitud");
    }
  };

  return (
    <div className="login-fondo">
      <form onSubmit={manejarEnvio} className="login-card">
        <h2>Recuperar Contraseña</h2>

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />

        <button className="login-boton">Enviar correo de recuperación</button>

        {mensaje && <p className="login-mensaje">{mensaje}</p>}
      </form>
    </div>
  );
}
