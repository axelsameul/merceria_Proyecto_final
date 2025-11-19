import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:3001/api/auth/reset-password?token=${token}`,
        { nuevaPassword, confirmarPassword }
      );

      setMensaje("Contraseña actualizada correctamente ✔️");
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al cambiar contraseña");
    }
  };

  return (
    <div className="login-fondo">
      <form onSubmit={manejarEnvio} className="login-card">
        <h2>Restablecer Contraseña</h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          className="login-input"
        />

        <button className="login-boton">Cambiar contraseña</button>

        {mensaje && <p className="login-mensaje">{mensaje}</p>}
      </form>
    </div>
  );
}
