"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Imagen, Producto, Variante } from "@prisma/client";
import { Dot, Images, MoreHorizontal, Pencil, Square, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  Producto: Producto & {
    imagenes: Imagen[],
    variantes: (Variante)[]
  }
}
export default function Client({ Producto }: Props) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
        <Card >
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              {Producto.titulo}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Square className={`size-3 ${Producto.estado ? "text-green-500" : "text-destructive"}`} />
                {
                  Producto.estado ? "Publicado" : "Sin publicar"
                }
              </Badge>
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-foreground opacity-100"
                    onClick={() => {
                      router.push(`/dashboard/productos/${Producto.id}/editar`);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-foreground opacity-100">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-foreground/70 flex flex-col divide-y">
            <div className="p-4 grid grid-cols-2 gap-2">
              <span>
                Título
              </span>
              <p>
                {Producto.titulo || "No hay título disponible."}
              </p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <span>
                Subtítulo
              </span>
              <p>
                {Producto.subtitulo}
              </p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <span>
                URL de acceso
              </span>
              <p>
                {Producto.url || "No hay URL de acceso disponible."}
              </p>
            </div>

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              Imágenes y medios
            </CardTitle>
            <Button variant="secondary" size={"sm"} asChild>
              <Link href={`/dashboard/productos/${Producto.id}/media`}>
                Modificar
              </Link>
            </Button>
          </CardHeader>
          <CardContent>


            {
              Producto.imagenes.length > 0 ?
                <div className="p-4 flex wrap gap-4">
                  {
                    Producto.imagenes.map(imagen => (
                      <div key={imagen.id} className="relative">
                        <Image src={imagen.url} alt="imagen" width={50} height={50} className="w-30 h-30 rounded-sm object-cover" />
                        {
                          imagen.orden == 0 && (
                            <Badge className="absolute w-6 p-0 h-6 top-1 right-1">
                              <Images className="size-3" />
                            </Badge>)
                        }
                      </div>
                    ))
                  }
                </div> :
                <div className=" flex flex-col gap-2 pt-7 pb-6  justify-center items-center">
                  <p className="font-semibold text-sm text-foreground/70 ">
                    Sin medios agregados
                  </p>
                  <p className="text-foreground/50 text-sm">
                    Agrega medios para poder ver
                  </p>
                  <Button onClick={() => {
                    router.push(`/dashboard/productos/${Producto.id}/media`)
                  }} variant="secondary" size="sm" className="mt-4">
                    Agregar
                  </Button>
                </div>
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}