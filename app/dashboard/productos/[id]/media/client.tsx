"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Imagen, Producto,  Variante } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move"; // asegúrate de tener este paquete instalado
import { GalleryThumbnails, GripVertical, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useModal } from "@/providers/modalprovider";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Props {
    Producto: Producto & {
        imagenes: Imagen[]
    }
}

export default function Client({ Producto }: Props) {
    const [imagenes, setImagenes] = useState<(Imagen[])>([]);
    useEffect(() => {
        setImagenes(Producto.imagenes || []);
    }, [Producto.imagenes]);
    const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
    const [sorted, setSorted] = useState(false);
    const { openModal } = useModal();
    const router = useRouter();
    const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<Imagen[]>([]);
    const handleSortEnd = (oldIndex: number, newIndex: number) => {
        setSorted(true);
        setImagenes(prev => arrayMoveImmutable(prev, oldIndex, newIndex));
    };
    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setNuevasImagenes((prev) => arrayMoveImmutable(prev, oldIndex, newIndex));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const nuevas = Array.from(e.target.files);
            setNuevasImagenes(nuevas)
        }
    };



    return (
        <>
            <Dialog onOpenChange={() => router.replace(`/dashboard/productos/${Producto.id}`)} defaultOpen>
                <DialogContent className="h-screen">
                    <DialogHeader className="flex bg-card items-center h-12 justify-start ">
                        <DialogTitle className="sr-only">Modificar medios</DialogTitle>
                        <Button className="mx-1" onClick={() => router.back()} variant="ghost">
                            <X className="size-3" />
                        </Button>
                        <Badge variant="secondary" >
                            esc
                        </Badge>
                    </DialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="p-4 space-y-2 lg:order-last">
                            <Label htmlFor="descripcion">
                                Imágenes
                            </Label>
                            <Input
                                onChange={handleFileChange}
                                accept="image/*"
                                type="file"
                                multiple
                                className="cursor-pointer"
                            />
                            <SortableList draggedItemClassName="z-50" onSortEnd={onSortEnd} className="flex flex-col gap-3">
                                {nuevasImagenes.map((file, index) => (
                                    <SortableItem key={file.name}>
                                        <Card className="py-2 px-3 flex-row items-center justify-between ">
                                            <div className='flex gap-4'>
                                                <div className="flex items-center gap-2">
                                                    <Button type='button' variant="ghost" className='cursor-grab'>
                                                        <GripVertical className="size-4 opacity-50" />
                                                    </Button>
                                                    <div className="w-8 h-12 relative">
                                                        <Image
                                                            alt={file.name}
                                                            src={URL.createObjectURL(file)}
                                                            fill
                                                            objectFit="cover"
                                                            className="rounded"
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                    <span className="text-xs font-semibold ">{file.name}</span>
                                                    <span className="text-xs text-gray-400 font-semibold">
                                                        {
                                                            file.size > 1024 * 1024 ?
                                                                `${(file.size / (1024 * 1024)).toFixed(2)} MB` :
                                                                `${(file.size / 1024).toFixed(2)} KB`
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                <Card className={`h-6 w-6 py-0 flex font-semibold items-center justify-center text-xs `}>
                                                    {imagenes.length + index + 1}
                                                </Card>
                                                <Button
                                                    variant="ghost"
                                                    type="button"
                                                    size="icon"
                                                    onClick={() => {
                                                        setNuevasImagenes(prev => prev.filter(value => value != file))
                                                    }}
                                                    className="hover:text-primary "
                                                >
                                                    <X className='size-4' />
                                                </Button>
                                            </div>
                                        </Card>
                                    </SortableItem>
                                ))}
                            </SortableList>
                        </div>
                        <div className="p-6 col-span-1 lg:col-span-2 bg-background h-screen">
                            <SortableList
                                className="flex gap-2 flex-wrap"
                                draggedItemClassName="z-100"
                                onSortEnd={handleSortEnd}
                            >
                                {imagenes
                                    .map((imagen, index) => (
                                        <SortableItem key={imagen.id}>
                                            <Card className="relative cursor-grab w-32 h-32  overflow-hidden border">

                                                <Badge
                                                    variant="default"
                                                    className="absolute top-1 right-1 h-6  z-10"
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <Checkbox
                                                    checked={imagenesSeleccionadas.includes(imagen)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked)
                                                            setImagenesSeleccionadas(prev => [...prev, imagen]);
                                                        else
                                                            setImagenesSeleccionadas(prev => prev.filter(img => img.id !== imagen.id));
                                                    }}
                                                    className="absolute top-1 left-1 z-10"
                                                />




                                                <SortableKnob>
                                                    <Image
                                                        src={imagen.url}
                                                        alt="imagen"
                                                        fill
                                                        className=" object-cover"
                                                    />
                                                </SortableKnob>

                                            </Card>

                                        </SortableItem>
                                    ))
                                }
                            </SortableList>

                        </div>
                    </div>
                    {(imagenesSeleccionadas.length > 0 || nuevasImagenes.length > 0 || sorted) && (
                        <ToggleGroup value="" className="fixed bottom-10  left-1/2 transform -translate-x-1/2 " type="single">
                            {
                                !sorted && (
                                    <>
                                        <ToggleGroupItem disabled value="a">
                                            {
                                                imagenesSeleccionadas.length > 0 && (
                                                    <span className=" font-medium">
                                                        {imagenesSeleccionadas.length} seleccionada{imagenesSeleccionadas.length !== 1 ? "s" : ""}
                                                    </span>
                                                )

                                            }
                                            {
                                                nuevasImagenes.length > 0 && (
                                                    <span className=" font-medium">
                                                        {nuevasImagenes.length} añadida{nuevasImagenes.length !== 1 ? "s" : ""}
                                                    </span>
                                                )
                                            }
                                        </ToggleGroupItem>
                                        {
                                            imagenesSeleccionadas.length > 0 && (<ToggleGroupItem 
                                                value="b" onClick={() => {
                                                    openModal({
                                                        content: "¿Estás seguro de que deseas eliminar las imágenes seleccionadas?",
                                                        titulo: "Confirmar eliminación",
                                                        url: "/api/producto/imagenes/eliminar",
                                                        data: {
                                                            imagenes: imagenesSeleccionadas
                                                        },
                                                        callback(res: any) {
                                                            router.refresh();
                                                            setImagenesSeleccionadas([]);
                                                        }
                                                    })
                                                }} className="px-2 hover:text-destructive">Eliminar</ToggleGroupItem>)
                                        }
                                    </>
                                )
                            }

                            {
                                nuevasImagenes.length > 0 && (
                                    <ToggleGroupItem
                                        value="b" onClick={() => {
                                            let formData = new FormData();
                                            nuevasImagenes.forEach((file) => {
                                                formData.append("imagenes", file);
                                            });
                                            formData.append("productoId", Producto.id);
                                            toast.promise(

                                                fetch("/api/producto/imagenes", {
                                                    method: "POST",
                                                    body: formData,
                                                }), {
                                                loading: "Subiendo imágenes",
                                                success(res: any) {
                                                    if (res.status == 200) {
                                                        router.refresh();
                                                        setNuevasImagenes([]);
                                                        return "Subido exitosamente"
                                                    }
                                                },
                                                error() {
                                                    return "Ha ocurrido un error"
                                                }
                                            })
                                        }} className="px-2 pr-3">
                                        <Upload />
                                        Subir</ToggleGroupItem>

                                )
                            }
                            {
                                sorted && (
                                    <ToggleGroupItem
                                        value="b" onClick={() => {

                                            toast.promise(

                                                fetch("/api/producto/imagenes/ordenar", {
                                                    method: "POST",
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({ imagenes, productoId: Producto.id }),
                                                }), {
                                                loading: "Ordenando imágenes",
                                                success(res: any) {
                                                    if (res.status == 200) {
                                                        router.refresh();
                                                        setSorted(false);
                                                        return "Ordenado exitosamente"
                                                    }
                                                }
                                            })
                                        }} className="px-5 ">
                                        Ordenar imágenes</ToggleGroupItem>
                                )
                            }
                        </ToggleGroup>
                    )}
                </DialogContent>
            </Dialog >

        </>
    );
}
