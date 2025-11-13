const pool = require('../config/dataBase');

// 📦 Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM categorias');
    res.json(result);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías', detalle: err.message });
  }
};

// 🛒 Obtener productos por categoría
const getProductosPorCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const [result] = await pool.query('SELECT * FROM productos WHERE id_categoria = ?', [id_categoria]);
    if (result.length === 0) return res.status(404).json({ mensaje: 'No hay productos en esta categoría' });
    res.json(result);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
  }
};

// 🍽️ Obtener todos los productos con su categoría
const getProductosConCategoria = async (req, res) => {
  try {
    const sql = `
      SELECT p.id, p.nombre, p.precio, p.imagen, c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      ORDER BY p.id ASC
    `;
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (err) {
    console.error('Error al obtener productos con categoría:', err);
    res.status(500).json({ error: 'Error al obtener productos', detalle: err.message });
  }
};

// 🆕 Agregar producto
const agregarProducto = async (req, res) => {
  const { nombre, precio, id_categoria } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!nombre || !precio || !id_categoria)
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });

  try {
    await pool.query(
      "INSERT INTO productos (nombre, precio, id_categoria, imagen) VALUES (?, ?, ?, ?)",
      [nombre, precio, id_categoria, imagen]
    );
    res.json({ mensaje: "Producto agregado correctamente" });
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).json({ mensaje: "Error al agregar producto", detalle: err.message });
  }
};

// ✏️ Editar producto
const editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, id_categoria } = req.body;
  const imagen = req.file ? req.file.filename : null;

  try {
    await pool.query(
      "UPDATE productos SET nombre = ?, precio = ?, id_categoria = COALESCE(?, id_categoria), imagen = COALESCE(?, imagen) WHERE id = ?",
      [nombre, precio, id_categoria, imagen, id]
    );
    res.json({ mensaje: "Producto actualizado correctamente" });
  } catch (err) {
    console.error('Error al editar producto:', err);
    res.status(500).json({ mensaje: "Error al editar producto", detalle: err.message });
  }
};

// 🗑 Eliminar producto
const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ mensaje: "Producto eliminado" });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ mensaje: "Error al eliminar producto", detalle: err.message });
  }
};

// 🔍 Obtener producto por ID
const getProductoPorId = async (req, res) => {
  try {
    console.log("📩 Parámetros recibidos:", req.params);

    // ✅ ahora usamos "id" (no "id_producto")
    const { id } = req.params;
    console.log("🔹 ID del producto recibido:", id);

    const sql = 'SELECT * FROM productos WHERE id = ?';
    console.log("🧩 Consulta SQL:", sql);

    const [result] = await pool.query(sql, [id]);
    console.log("📦 Resultado SQL:", result);

    if (result.length === 0) {
      console.warn("⚠️ Producto no encontrado para ID:", id);
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(result);
  } catch (err) {
    console.error("💥 Error al obtener producto:", err);
    res.status(500).json({ error: 'Error al obtener producto', detalle: err.message });
  }
};

module.exports = {
  getCategorias,
  getProductosPorCategoria,
  getProductosConCategoria,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  getProductoPorId
};
