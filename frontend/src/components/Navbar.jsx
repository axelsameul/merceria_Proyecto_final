import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import "../App.css";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { carrito } = useCarrito();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Cantidad total de productos en el carrito
  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1548/1548682.png"
            alt="logo"
          />
          <h1>Dulce Hilo</h1>
        </Link>

        <div className="nav-links">
          <Link to="/">Inicio</Link>

          <Link to="/carrito">
            Carrito {totalItems > 0 && `(${totalItems})`}
          </Link>

          {!usuario ? (
            <Link to="/login" className="btn-login">
              Iniciar sesión
            </Link>
          ) : (
            <>
              {usuario.rol === "admin" && (
                <>
                  <Link to="/adminPanel">Panel Admin</Link>
                  <Link to="/movimiento">Movimientos</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn-logout">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
