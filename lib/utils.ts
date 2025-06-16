import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tallasAlfabeticas = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
export const tallasNumericas = ["36", "38", "40", "42", "44", "46", "48", "50"];

export function generarVariantes({
  tallas,
  tallas2,
  colores,
}: {
  tallas: string[];
  tallas2: string[];
  colores: { nombre: string; codigo: string }[];
}): {
  titulo: string;
  precio: string;
  estado: boolean;
  tipo: "POR_DEFECTO" | "OPCION";
  codigoHexColor?: string;
  talla?: string;
}[] {
  const variantes: {
    titulo: string;
    precio: string;
    estado: boolean;
    tipo: "POR_DEFECTO" | "OPCION";
    codigoHexColor?: string;
    talla?: string;
  }[] = [];
  const todasLasTallas = [...tallas, ...tallas2];
  const hayTallas = todasLasTallas.length > 0;
  const hayColores = colores.length > 0;
  if (hayTallas && hayColores) {
    // Combinaciones completas: Color / Talla
    for (const talla of todasLasTallas) {
      for (const color of colores) {
        variantes.push({
          titulo: `En talla ${talla} / Color: ${color.nombre}`,
          precio: "0",
          codigoHexColor: color.codigo,
          talla,
          tipo: "OPCION",
          estado: true,
        });
      }
    }
  } else if (hayTallas) {
    // Solo tallas
    for (const talla of todasLasTallas) {
      variantes.push({
        titulo: "En talla " + talla,
        precio: "0",
        codigoHexColor: "",
        talla,
        tipo: "OPCION",
        estado: true,
      });
    }
  } else if (hayColores) {
    // Solo colores
    for (const color of colores) {
      variantes.push({
        titulo: "Color: " + color.nombre,
        precio: "0",
        codigoHexColor: color.codigo,
        talla: "",
        tipo: "OPCION",
        estado: true,
      });
    }
  }

  return variantes;
}


// utils/modalCallbackRef.ts
type ModalCallback = (response: {
  success: boolean;
  data?: any;
  error?: any;
  message?: string;
}) => void;

let callback: ModalCallback | null = null;

export const setModalCallback = (cb: ModalCallback | null) => {
  callback = cb;
};

export const getModalCallback = () => callback;





export type FormularioNuevoProducto = {
  titulo: string;
  descripcion: string;
  subtitulo?: string;
  url?: string;
  descuento: string; // lo convertirás a float
  descontable: boolean;
  estado: "NUEVO" | "USADO";
  colores: { codigo: string, nombre: string }[]
  tieneVariantes: boolean,
  tallas: string[]
  tallas2: string[]
  visible: boolean;
  variantes: {
    titulo: string;
    precio: string;
    estado: boolean;
    tipo: "POR_DEFECTO" | "OPCION";
    codigoHexColor?: string;
    talla?: string;
  }[];
};