import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

const AdminMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState({});
  const [nuevo, setNuevo] = useState({
    tipo: "",
    descripcion: "",
    monto: "",
  });
  const [productoMasVendido, setProductoMasVendido] = useState("");

  // 🟣 Traer todos los movimientos
  const fetchMovimientos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/movimientos");
      setMovimientos(res.data);
      calcularProductoMasVendido(res.data);
    } catch (err) {
      console.error("Error al traer movimientos:", err);
    }
  };

  // 🟢 Traer resumen general
  const fetchResumen = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/movimientos/resumen");
      setResumen(res.data);
    } catch (err) {
      console.error("Error al traer resumen:", err);
    }
  };

  // 🧮 Calcular producto más vendido
  const calcularProductoMasVendido = (movs) => {
    const ventas = movs.filter((m) => m.tipo === "ingreso");
    const conteo = {};
    ventas.forEach((v) => {
      const desc = v.descripcion.trim().toLowerCase();
      conteo[desc] = (conteo[desc] || 0) + 1;
    });

    let maxProducto = "";
    let maxCantidad = 0;
    for (const [desc, cantidad] of Object.entries(conteo)) {
      if (cantidad > maxCantidad) {
        maxProducto = desc;
        maxCantidad = cantidad;
      }
    }

    setProductoMasVendido(maxProducto ? `${maxProducto} (${maxCantidad} ventas)` : "Sin ventas registradas");
  };

  useEffect(() => {
    fetchMovimientos();
    fetchResumen();
  }, []);

const handleDelete = async (id) => {
  if (!window.confirm("¿Estás seguro de eliminar este movimiento?")) return;
  try {
    await axios.delete(`http://localhost:3001/api/movimientos/${id}`);
    fetchMovimientos(); // Actualizamos la tabla
    fetchResumen(); // Actualizamos el resumen
  } catch (err) {
    console.error("Error al eliminar movimiento:", err);
  }
};


  // 🟠 Agregar nuevo movimiento
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevo.tipo || !nuevo.descripcion || !nuevo.monto) {
      alert("Completa todos los campos");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/movimientos", nuevo);
      setNuevo({ tipo: "", descripcion: "", monto: "" });
      fetchMovimientos();
      fetchResumen();
    } catch (err) {
      console.error("Error al agregar movimiento:", err);
    }
  };

  return (
    <div className="admin-movimientos">
      <h2 className="titulo-movimientos">📊 Movimientos</h2>

      <div className="resumen-tarjetas">
        <div className="tarjeta resumen-ingreso">
          <h3>Ingresos Totales</h3>
          <p>${resumen.total_ingresos || 0}</p>
        </div>
        <div className="tarjeta resumen-gasto">
          <h3>Gastos Totales</h3>
          <p>${resumen.total_gastos || 0}</p>
        </div>
        <div className="tarjeta resumen-saldo">
          <h3>Saldo Actual</h3>
          <p>${resumen.saldo || 0}</p>
        </div>
        <div className="tarjeta resumen-producto">
          <h3>Más Vendido</h3>
          <p>{productoMasVendido}</p>
        </div>
        {/* 🟢 NUEVA TARJETA: Total de movimientos */}
        <div className="tarjeta resumen-total-mov">
          <h3>Total de Movimientos</h3>
          <p>{movimientos.length}</p>
        </div>
      </div>

      <form className="formulario-mov" onSubmit={handleSubmit}>
        <select
          value={nuevo.tipo}
          onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
        >
          <option value="">Seleccionar tipo</option>
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>

        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
        />

        <input
          type="number"
          placeholder="Monto"
          value={nuevo.monto}
          onChange={(e) => setNuevo({ ...nuevo, monto: e.target.value })}
        />

        <button type="submit">Agregar</button>
      </form>

      <div className="tabla-contenedor">
        <table className="tabla-modern">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id_movimiento}>
                <td>{new Date(m.fecha).toLocaleDateString()}</td>
                <td className={m.tipo === "ingreso" ? "ingreso" : "gasto"}>
                  {m.tipo}
                </td>
                <td>{m.descripcion}</td>
                <td>${m.monto}</td>
                 <td>
        <button
          className="btn-eliminar"
          onClick={() => handleDelete(m.id_movimiento)}
        >
          Eliminar
        </button>
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMovimientos;
