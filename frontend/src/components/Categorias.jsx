import { useEffect, useState } from "react";
import { getCategorias } from "../api/api";

export default function Categorias({ onSelectCategoria }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await getCategorias();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);



  useEffect(()=>{
    const dbCategoria= async (params) => {
      const data= await getCategorias()
      setCategorias(data)
    }
    dbCategoria()
  },[])

  return (
    <div className="categorias-card">
      <select
        onChange={(e) => onSelectCategoria(e.target.value || null)}
        className="select-categoria"
      >
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
