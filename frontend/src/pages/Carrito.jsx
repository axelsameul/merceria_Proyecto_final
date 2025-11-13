import { useCarrito } from "../context/CarritoContext";
import axios from "axios";
import { useState } from "react";

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
        `📦 *Nuevo pedido de MERCERÍA*\n\n👤 Cliente: ${nombre}\n📞 Teléfono: ${telefono}\n🏠 Dirección: ${direccion}\n\n🛍️ *Productos:*\n${carrito
          .map(
            (item) =>
              `• ${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}`
          )
          .join("\n")}\n\n💰 *Total:* $${total}\n\n✨ ¡Gracias por tu compra! ✨`
      );

      const numero = "54911XXXXXXXX"; // <-- poné tu número real
      window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

      limpiarCarrito();
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Hubo un problema al enviar el pedido.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          🛍️ Tu Carrito
        </h2>

        {carrito.length === 0 ? (
          <p className="text-gray-500 text-center">No hay productos en el carrito.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-4">
              {carrito.map((item) => (
                <li key={item.id} className="flex justify-between py-2 text-gray-700">
                  <span>
                    {item.nombre} <span className="text-sm text-gray-400">x{item.cantidad}</span>
                  </span>
                  <span className="font-semibold">${item.precio * item.cantidad}</span>
                </li>
              ))}
            </ul>

            <div className="text-right text-lg font-bold text-gray-800 mb-6">
              Total: <span className="text-pink-600">${total}</span>
            </div>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="👤 Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <input
                type="text"
                placeholder="📞 Tu teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <input
                type="text"
                placeholder="🏠 Tu dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            <button
              onClick={enviarPedido}
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-all shadow-md"
            >
              ✅ Confirmar pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrito;
