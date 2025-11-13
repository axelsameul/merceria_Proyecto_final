import { Navigate } from "react-router-dom";

export default function RutaProtegida({ children }) {
  const isAdmin = true; // Cambialo por false para probar bloqueo

  return isAdmin ? children : <Navigate to="/login" replace />;
}
