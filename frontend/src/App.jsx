import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import AdminMovimientos from "./pages/AdminMovimientos";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";
import "./App.css"; // 👈 Import correcto del CSS


function App() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <CarritoProvider>
      <div className="body-home  min-h-screen flex flex-col  from-beige-100 via-beige-50 to-turquoise-50 text-gray-800 font-sans">
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        <main className="home-conta max-w-6xl mx-auto w-full px-6 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            {usuario?.rol === "admin" && (
              <>
                 
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/movimiento" element={<AdminMovimientos />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="bg-teal-600 text-white py-6 text-center shadow-inner">
          <p className="text-sm tracking-wide">
            © 2025 <span className="font-semibold">Mercería Dulce Hilo</span> — Todos los derechos reservados.
          </p>
          <div className="mt-2 flex justify-center gap-3 text-beige-100">
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
