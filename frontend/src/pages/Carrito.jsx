import { useCarrito } from "../context/CarritoContext";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "../Carrito.css";

const Carrito = () => {
  const { carrito, vaciarCarrito, quitarDelCarrito } = useCarrito();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const direccionRef = useRef(null);

  // 🔥 GOOGLE MAPS AUTOCOMPLETE
  useEffect(() => {
    if (!window.google || !direccionRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      direccionRef.current,
      {
        componentRestrictions: { country: "ar" }, // Argentina
        fields: ["formatted_address", "address_components", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) setDireccion(place.formatted_address);
    });
  }, []);

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const enviarPedido = async () => {
    if (!nombre || !telefono || !direccion) {
      alert("Completa todos los campos antes de enviar el pedido.");
      return;
    }

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
    (item) =>
      `${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}`
  )
  .join("\n")}

Total: $${total}`
      );

      // 🔥 Número de WhatsApp: 54 + código de área + número sin 0 inicial
      const numero = "543813676949"; 
      window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

      vaciarCarrito();
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
                  <div className="carrito-info">
                    <span>
                      {item.nombre}{" "}
                      <span className="carrito-cantidad">x{item.cantidad}</span>
                    </span>

                    <span className="carrito-precio">
                      ${item.precio * item.cantidad}
                    </span>
                  </div>

                  <button
                    className="carrito-eliminar"
                    onClick={() => {
                      const confirmar = window.confirm(
                        "¿Seguro que quieres eliminar este producto?"
                      );
                      if (confirmar) quitarDelCarrito(item.id);
                    }}
                  >
                    ❌
                  </button>
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

              {/* 🔥 TELÉFONO CON LÍMITE 13 NÚMEROS */}
              <input
                type="text"
                placeholder="Tu teléfono"
                value={telefono}
                maxLength={13}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "");
                  if (valor.length <= 13) setTelefono(valor);
                }}
              />

              {/* 🔥 DIRECCIÓN CON GOOGLE MAPS */}
              <input
                type="text"
                placeholder="Tu dirección"
                ref={direccionRef}
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
