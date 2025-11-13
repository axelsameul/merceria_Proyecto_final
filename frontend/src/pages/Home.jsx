import { useState } from "react";
import Categorias from "../components/Categorias";
import Productos from "../components/Productos";
import "../App.css";

export default function Home() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <div className="home-container">
      <h1 className="titulo-principal">Catálogo de Productos</h1>

      {/* 🔹 Select centrado */}
      <div className="categorias-barra">
        <Categorias onSelectCategoria={setCategoriaSeleccionada} />

        {categoriaSeleccionada && (
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className="boton-volver"
          >
            Ver todos los productos
          </button>
        )}
      </div>

      {/* 🔹 Productos a todo el ancho */}
      <div className="productos-full">
        {categoriaSeleccionada ? (
          <>
            <h3 className="subtitulo">Productos de la categoría seleccionada</h3>
            <Productos idCategoria={categoriaSeleccionada} />
          </>
        ) : (
          <>
            <h3 className="subtitulo">Productos destacados ✨</h3>
            <Productos destacados={true} />
          </>
        )}
      </div>
    </div>
  );
}
