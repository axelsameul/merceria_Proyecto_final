import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../App.css"; // 👈 asegurate de tenerlo importado

export default function Productos({ idCategoria, destacados = false }) {
  const [productos, setProductos] = useState([]);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
  const fetchProductos = async () => {
    try {
      let url = "http://localhost:3001/api/productos";

      if (idCategoria) {
        // Si hay categoría, traemos todos los productos de esa categoría
        url = `http://localhost:3001/api/productos/categoria/${idCategoria}`;
      } else {
        // Si no hay categoría, traemos solo los destacados
        url = "http://localhost:3001/api/productos?destacados=true";
      }

      const res = await axios.get(url);
      let data = res.data;

      // Limitar a 10 productos si NO hay categoría seleccionada
      if (!idCategoria) {
        data = data.slice(0, 12); // toma los primeros 10
      }

      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  fetchProductos();
}, [idCategoria, destacados]);


  return (
    <div className="productos-full">
      <h2 className="subtitulo">
        {idCategoria ? "Productos por categoría" : "Todos los productos disponibles 🧵"}
      </h2>

      {productos.length === 0 ? (
        <p className="sin-productos">No hay productos disponibles.</p>
      ) : (
        <div className="grid-productos">
          {productos.map((p) => (
            <div key={p.id} className="tarjeta-producto">
              <img
                src={
                  p.imagen
                    ? p.imagen.startsWith("http")
                      ? p.imagen
                      : `http://localhost:3001/uploads/${p.imagen}`
                    : "https://via.placeholder.com/300x200?text=Sin+imagen"
                }
                alt={p.nombre}
                className="imagen-producto"
              />

              <div className="detalle-producto">
                <h3>{p.nombre}</h3>
                <p className="precio">${p.precio}</p>

                <div className="acciones-producto">
                  <Link to={`/producto/${p.id}`} className="btn-ver">
                    Ver
                  </Link>
                  <button
                    onClick={() => agregarAlCarrito(p)}
                    className="btn-agregar"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
