import { useCarrito } from "../context/CarritoContext";
import axios from "axios";
import { useState } from "react";
import "../Carrito.css";  // importa el CSS

const Carrito = () => {
  const { carrito, limpiarCarrito } = useCarrito();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const enviarPedido = async () => {
    try {
      const pedido = {
        nombre_cliente: nombre,
        telefono,
        direccion,
        carrito,
        total,
      };

      await axios.post("http://localhost:3001/api/pedidos", pedido);

      const mensaje = encodeURIComponent(
        `Nuevo pedido de MERCERÍA

Cliente: ${nombre}
Teléfono: ${telefono}
Dirección: ${direccion}

Productos:
${carrito
  .map(
    (item) => `${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}`
  )
  .join("\n")}

Total: $${total}`
      );

      const numero = "54911XXXXXXXX"; 
      window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

      limpiarCarrito();
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("Hubo un problema al enviar el pedido.");
    }
  };

  return (
    <div className="carrito-container">
      <div className="carrito-card">
        <h2 className="carrito-title">Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">No hay productos en el carrito.</p>
        ) : (
          <>
            <ul className="carrito-lista">
              {carrito.map((item) => (
                <li key={item.id} className="carrito-item">
                  <span>
                    {item.nombre} <span className="carrito-cantidad">x{item.cantidad}</span>
                  </span>
                  <span className="carrito-precio">${item.precio * item.cantidad}</span>
                </li>
              ))}
            </ul>

            <div className="carrito-total">
              Total: <span>${total}</span>
            </div>

            <div className="carrito-form">
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tu teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tu dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            <button className="carrito-btn" onClick={enviarPedido}>
              Confirmar pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrito;
