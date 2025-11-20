import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../index.css";

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3001/api/productos/producto-detalle/${id}`)
      .then((res) => {
        setProducto(res.data[0]);
      })
      .catch((err) => console.error("❌ Error obteniendo producto:", err));
  }, [id]);

  if (!producto) return <p className="cargando">Cargando producto...</p>;

  // 🔥 Corrección: siempre construimos una URL válida
  const imagenUrl = producto.imagen
  ? producto.imagen.startsWith("http")
    ? producto.imagen
    : producto.imagen.includes("/")
      ? `http://localhost:3001/${producto.imagen.replace(/\\/g, "/")}`
      : `http://localhost:3001/uploads/${producto.imagen}`
  : "";


  return (
    <div className="detalle-container">
      <div className="detalle-card">
        <h1 className="detalle-titulo">{producto.nombre}</h1>

        <p className="detalle-precio">${producto.precio}</p>

        {imagenUrl && (
          <img
            className="detalle-imagen"
            src={imagenUrl}
            alt={producto.nombre}
            onError={(e) => {
              console.error("❌ Error cargando imagen:", imagenUrl);
              e.target.style.display = "none";
            }}
          />
        )}

        <p className="detalle-desc">{producto.descripcion}</p>
      </div>
    </div>
  );
}

export default DetalleProducto;
