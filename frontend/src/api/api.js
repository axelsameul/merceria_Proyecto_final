import axios from "axios";

const API_URL = "http://localhost:3001/api/productos"; // tu backend

// 🔹 Obtener todas las categorías
export const getCategorias = async () => {
  try {
    const res = await axios.get(`${API_URL}/categorias`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};

// 🔹 Obtener productos por categoría
export const getProductosPorCategoria = async (idCategoria) => {
  try {
    const res = await axios.get(`${API_URL}/categoria/${idCategoria}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return [];
  }
};

// 🔹 Obtener *todos* los productos
export const getProductos = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    return [];
  }
};
