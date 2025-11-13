// 💾 Crear base de datos llamada 'merceria'
const sql = `

CREATE DATABASE merceria;
USE merceria;

-- 🗂️ Crear tabla 'categorias'
-- Guarda las distintas categorías de productos (ej: Mercería, Accesorios, etc.)
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- 🛍️ Crear tabla 'productos'
-- Contiene los productos con su nombre, precio y categoría asociada
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  id_categoria INT,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- 🧾 Insertar las categorías iniciales
INSERT INTO categorias (nombre) VALUES
('Mercería'),
('Accesorios'),
('Textiles'),
('Costura'),
('Decoración'),
('Manualidades'),
('Papelería'),
('Bebés'),
('Hogar'),
('Moda');

-- 📦 Insertar productos asociados a cada categoría
INSERT INTO productos (nombre, precio, id_categoria) VALUES
-- 🧵 Mercería
('Botones surtidos', 350.00, 1),
('Cierres metálicos 20cm', 450.00, 1),
('Hilos de colores x10', 1200.00, 1),
('Agujas de coser', 250.00, 1),
('Elástico blanco 2m', 300.00, 1),

-- 💍 Accesorios
('Broches imantados', 600.00, 2),
('Hebillas metálicas', 550.00, 2),
('Llaveros personalizados', 900.00, 2),
('Pulsera de tela', 700.00, 2),
('Collar artesanal', 1500.00, 2),

-- 🧶 Textiles
('Tela de algodón 1m', 1800.00, 3),
('Lona estampada', 2500.00, 3),
('Seda natural 1m', 5500.00, 3),
('Friselina color', 900.00, 3),
('Tull blanco 1m', 1300.00, 3),

-- ✂️ Costura
('Máquina de coser portátil', 35000.00, 4),
('Tijera de costura', 2500.00, 4),
('Descosedor', 600.00, 4),
('Cinta métrica', 400.00, 4),
('Alfileres con cabeza', 800.00, 4),

-- 🎀 Decoración
('Cinta de raso 10m', 850.00, 5),
('Lentejuelas doradas 50g', 600.00, 5),
('Flores de tela', 700.00, 5),
('Cinta de encaje', 1200.00, 5),
('Moños adhesivos', 550.00, 5),

-- 🖌️ Manualidades
('Pistola de silicona', 3500.00, 6),
('Barras de silicona x10', 1200.00, 6),
('Cartulina de colores', 800.00, 6),
('Pegamento universal', 700.00, 6),
('Pinceles surtidos', 1500.00, 6),

-- 📚 Papelería
('Cuaderno A4 rayado', 1800.00, 7),
('Lapicera azul', 300.00, 7),
('Marcadores permanentes x5', 1100.00, 7),
('Resaltadores x4', 950.00, 7),
('Post-it variados', 700.00, 7),

-- 👶 Bebés
('Babero de algodón', 900.00, 8),
('Manta para bebé', 2500.00, 8),
('Gorrito tejido', 1500.00, 8),
('Body estampado', 2800.00, 8),
('Guantecitos', 700.00, 8),

-- 🏠 Hogar
('Cortina de baño', 3800.00, 9),
('Alfombra chica', 4200.00, 9),
('Mantel estampado', 3500.00, 9),
('Funda de almohadón', 1200.00, 9),
('Toalla de mano', 900.00, 9),

-- 👗 Moda
('Bufanda tejida', 3200.00, 10),
('Gorra de lana', 2800.00, 10),
('Bolso artesanal', 5800.00, 10),
('Campera liviana', 9500.00, 10),
('Remera estampada', 3500.00, 10);

-- 🧾 Tabla de pedidos
-- Guarda los datos del cliente y el total del pedido
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(100),
  telefono VARCHAR(20),
  direccion VARCHAR(200),
  total DECIMAL(10,2),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📋 Tabla detalle de pedido
-- Guarda los productos que forman parte de cada pedido
CREATE TABLE pedido_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT,
  id_producto INT,
  cantidad INT,
  precio DECIMAL(10,2),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id)
);

-- 👥 Tabla de usuarios
-- Contiene los datos de acceso (admin o cliente)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);

-- 🔎 Consulta para listar productos con sus categorías
SELECT p.id, p.nombre AS producto, p.precio, c.nombre AS categoria
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id;

-- 🖼️ Agregar columna de imagen a productos
ALTER TABLE productos ADD COLUMN imagen VARCHAR(255) NULL;

-- 👑 Insertar usuario administrador
INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Administrador', 'admin@merceria.com', '123456', 'admin');

-- 💰 Tabla de movimientos (para registrar ingresos y gastos)
CREATE TABLE movimientos (
  id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('ingreso', 'gasto') NOT NULL,
  descripcion VARCHAR(255),
  monto DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

console.log("✅ Script SQL de la base de datos 'merceria' listo para ejecutar.");
