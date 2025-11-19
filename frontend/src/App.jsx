import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import AdminMovimientos from "./pages/AdminMovimientos";
import { CarritoProvider } from "./context/CarritoContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const { usuario } = useAuth();

  return (
    <CarritoProvider>
      <div className="layout">
        <header>
          <Navbar />
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />

            {usuario?.rol === "admin" && (
              <>
                <Route path="/adminPanel" element={<AdminPanel />} />
                <Route path="/movimiento" element={<AdminMovimientos />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="footer">
          <p className="footer-text">
            © 2025 <span className="footer-brand">Mercería Dulce Hilo</span> — Todos los derechos reservados.
          </p>

          <div className="footer-icons">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-whatsapp"></i>
          </div>
        </footer>
      </div>
    </CarritoProvider>
  );
}

export default App;
