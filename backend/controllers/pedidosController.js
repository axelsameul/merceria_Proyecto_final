const pool = require('../config/dataBase');

const crearPedido = async (req, res) => {
  const { nombre_cliente, telefono, direccion, carrito, total } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ mensaje: "El carrito está vacío" });
  }

  const connection = await pool.getConnection(); // ✔ async/await

  try {
    await connection.beginTransaction();

    const [pedidoResult] = await connection.query(
      "INSERT INTO pedidos (nombre_cliente, telefono, direccion, total) VALUES (?, ?, ?, ?)",
      [nombre_cliente, telefono, direccion, total]
    );

    const id_pedido = pedidoResult.insertId;

    for (const item of carrito) {
      await connection.query(
        "INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)",
        [id_pedido, item.id, item.cantidad, item.precio]
      );
    }

    await connection.commit();
    res.json({ mensaje: "Pedido creado correctamente", id_pedido });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el pedido", error });
  } finally {
    connection.release(); // liberamos la conexión
  }
};

module.exports = { crearPedido };
