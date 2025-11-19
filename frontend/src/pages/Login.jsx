import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/usuarios/login", {
        email,
        password,
      });

      login(res.data); // ✅ actualiza el contexto
      setMensaje("Inicio de sesión exitoso ✅");

      navigate("/homeAdmin");
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-fondo">
      <form onSubmit={manejarLogin} className="login-card">
        <h2 className="login-titulo">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-boton">
          Entrar
        </button>

        <p 
         className="login-olvido" 
         onClick={() => navigate("/recuperar-password")}
         style={{ cursor: "pointer", marginTop: "10px", color: "#007bff" }}
        >
        ¿Olvidaste tu contraseña?
        </p>


        {mensaje && <p className="login-mensaje">{mensaje}</p>}
      </form>
    </div>
  );
}
