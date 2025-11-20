import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../index.css";

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
 
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [editId, setEditId] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);

  const [search, setSearch] = useState("");

  const [pagina, setPagina] = useState(1);
  const productosPorPagina = 10;

  const { usuario } = useAuth();

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al traer productos:", err);
    }
  };

  useEffect(() => {
    if (usuario) {
      fetchProductos();
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
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
      setImagen(null);
      setImagenActual(null);
      fetchProductos();
    } catch (err) {
      console.error("Error al agregar/editar producto:", err);
    }
  };

  const handleEdit = (producto) => {
    setEditId(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setImagenActual(producto.imagen);
  };

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

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const indexUltimo = pagina * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <div className="admin-wrapper">

      <h2 className="titulo-admin">Panel de Administración</h2>

      {/* BUSQUEDA */}
      <div className="busqueda-filtros">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-sm"
        />
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form-admin">

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input-sm"
          required
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="input-sm"
          required
        />

        {editId && imagenActual && (
          <div className="preview-mini">
            <img
              src={
                imagenActual.startsWith("http")
                  ? imagenActual
                  : `http://localhost:3001/uploads/${imagenActual}`
              }
              alt="actual"
            />
          </div>
        )}

        <label className="btn-file-sm">
          Subir imagen
          <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
        </label>

        {imagen && <span className="file-name-sm">{imagen.name}</span>}

        <button className="btn-primary-sm">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* TABLA */}
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productosPagina.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>
                <img
                  src={
                    p.imagen.startsWith("http")
                      ? p.imagen
                      : `http://localhost:3001/uploads/${p.imagen}`
                  }
                  className="img-sm"
                />
              </td>
              <td>
                <button className="btn-edit-sm" onClick={() => handleEdit(p)}>Editar</button>
                <button className="btn-del-sm" onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINACIÓN */}
      <div className="paginacion-sm">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>◀</button>
        <span>{pagina} / {totalPaginas}</span>
        <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>▶</button>
      </div>

    </div>
  );
}
