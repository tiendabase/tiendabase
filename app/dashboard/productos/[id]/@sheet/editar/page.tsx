"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useModal } from "@/providers/modalprovider";
import { Producto } from "@prisma/client";
import { Loader, Slash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Page() {
    const router = useRouter();
    const { id } = useParams() as { id: string };

    const [loading, setLoading] = useState(true);
    const [producto, setProducto] = useState<Partial<Producto> | null>(null);

    const { control, reset, handleSubmit } = useForm<Partial<Producto>>({
        defaultValues: {
            titulo: "",
        },
    });
    const { openModal } = useModal();
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await fetch("/api/producto/obtener", {
                    method: "POST",
                    body: JSON.stringify({ id }),
                });
                const data = await res.json();
                setProducto(data);
                reset(data); // esto actualiza los valores del form
            } catch (error) {
                console.error("Error al obtener la publicación:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, reset]);

    if (!!producto)
        return (
            <Sheet
                onOpenChange={(open) => {
                    if (!open) router.replace(`/dashboard/productos/${producto?.id}`);
                }}
                defaultOpen
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Editar Publicación</SheetTitle>
                        <Separator />
                    </SheetHeader>

                    {loading ? <Loader className="animate-spin mx-auto mt-10" /> :
                        (
                            <div className="px-5 space-y-5">
                                <Controller
                                    control={control}
                                    name="titulo"
                                    render={({ field }) => <div className="space-y-2">
                                        <Label>
                                            Título
                                        </Label>
                                        <Input {...field} />
                                    </div>}
                                />
                                <Controller
                                    control={control}
                                    name="subtitulo"
                                    render={({ field }) => <div className="space-y-2">
                                        <Label>
                                            Subtítulo
                                        </Label>
                                        <Input {...field} />
                                    </div>}
                                />
                                <Controller
                                    control={control}
                                    name="url"
                                    render={({ field }) => <div className="space-y-2">
                                        <Label>
                                            Manejador
                                        </Label>
                                        <Input startContent={<Slash className="size-3" />} {...field} />
                                    </div>}
                                />

                                <Controller
                                    name="descripcion"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label className="mt-2" htmlFor="descripcion">
                                                Descripción {"(Opcional)"}
                                            </Label>
                                            <Textarea className="min-h-20"
                                                id="descripcion"
                                                {...field} rows={3} />
                                        </div>


                                    )} />
                            </div>
                        )
                    }
                    <SheetFooter>
                        <Button variant='secondary' onClick={() => {
                            router.back();
                        }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit(data => {
                            openModal({
                                titulo: "Confirmar cambios",
                                content: "¿Estás seguro de que quieres guardar los cambios?",
                                data,
                                url: "/api/producto/editar",
                                callback() {
                                    router.back();
                                    router.refresh();
                                }
                            });
                        })}>
                            Guardar cambios
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
}
