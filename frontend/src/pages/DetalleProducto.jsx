import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../index.css"; // 👈 Asegurate de tener esta línea para aplicar el CSS

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    console.log("🟢 ID recibido desde la URL:", id);

    if (!id) return;

    axios
      .get(`http://localhost:3001/api/productos/producto-detalle/${id}`)
      .then((res) => {
        console.log("📦 Producto recibido:", res.data);
        setProducto(res.data[0]);
      })
      .catch((err) => console.error("🔴 Error al obtener producto:", err));
  }, [id]);

  if (!producto) return <p className="cargando">Cargando producto...</p>;

  console.log("👀 Producto para render:", producto);

  return (
    <div className="detalle-container">
      <div className="detalle-card">
        <h1 className="detalle-titulo">{producto.nombre}</h1>
        <p className="detalle-precio">💰 Precio: ${producto.precio}</p>
        {producto.imagen && (
          <img
            className="detalle-imagen"
            src={
              producto.imagen.startsWith("http")
                ? producto.imagen
                : `http://localhost:3001/${producto.imagen}`
            }
            alt={producto.nombre}
          />
        )}
      </div>
    </div>
  );
}

export default DetalleProducto;
