import { createContext, useState, useContext, useEffect } from "react";

// Crear el contexto
const CarritoContext = createContext();

// Hook para acceder al carrito desde cualquier componente
export const useCarrito = () => useContext(CarritoContext);

// Proveedor del contexto
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    // Intentamos cargar desde localStorage
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Agregar producto
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Quitar producto
  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  // Vaciar carrito
  const vaciarCarrito = () => setCarrito([]);

  // Calcular total
  const total = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
