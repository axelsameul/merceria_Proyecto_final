import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Importante
import "../index.css";

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editId, setEditId] = useState(null);
  const { usuario } = useAuth(); // ✅ Aquí traemos el usuario del contexto

  // 📦 Traer productos
  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al traer productos:", err);
    }
  };

  // 🗂️ Traer categorías
  const fetchCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/productos/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error al traer categorías:", err);
    }
  };

  // 🧠 Solo carga los datos si el usuario está logueado
  useEffect(() => {
    if (usuario) {
      fetchProductos();
      fetchCategorias();
    }
  }, [usuario]);

  // 💾 Agregar o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    if (!editId) formData.append("id_categoria", idCategoria);
    if (imagen) formData.append("imagen", imagen);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3001/api/productos/editar/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setEditId(null);
      } else {
        await axios.post("http://localhost:3001/api/productos/agregar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setNombre("");
      setPrecio("");
      setIdCategoria("");
      setImagen(null);
      fetchProductos();
    } catch (err) {
      console.error("Error al agregar/editar producto:", err);
    }
  };

  // ✏️ Editar producto
  const handleEdit = (producto) => {
    setEditId(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setIdCategoria(producto.id_categoria);
  };

  // ❌ Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:3001/api/productos/eliminar/${id}`);
        fetchProductos();
      } catch (err) {
        console.error("Error al eliminar producto:", err);
      }
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-titulo">Panel de Administración</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />

        {!editId && (
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        )}

        <input type="file" onChange={(e) => setImagen(e.target.files[0])} />

        <button type="submit" className="admin-boton">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <table className="admin-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>
                {p.imagen && (
                  <img
                    src={`http://localhost:3001/uploads/${p.imagen}`}
                    alt={p.nombre}
                    className="admin-imagen"
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(p)} className="btn-editar">
                  Editar
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn-eliminar">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
