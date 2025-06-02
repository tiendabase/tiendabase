"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheck, Footprints, Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Imagen, Producto, Variante } from "@prisma/client";
import Detalles from "./detalles";
import { useState } from "react";
import Organizar from "./organizar";
import Variantes from "./variantes";
import { toast } from "sonner";
import { useModal } from "@/providers/modalprovider";
export default function CrearProducto() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [colores, setColores] = useState<{ codigo: string, nombre: string }[]>([]);
    const [tallas, setTallas] = useState([]);
    const [tallas2, setTallas2] = useState([]);
    const { control, getValues, trigger } = useForm<Producto & { variantes: Variante[], imagenes: Imagen[] }>({
        defaultValues: {
            titulo: "",
            variantes: [],
            descripcion: "",
            subtitulo: "",
            url: "",
            descontable: false
        }
    });
    const [tieneVariantes, setTieneVariantes] = useState(false);
    const [imagenes, setImagenes] = useState<File[]>([]);
    const { openModal } = useModal();
    const enviarDatos = async () => {

        openModal({
            content: "Se agregará un nuevo producto",
            replace: "/dashboard/productos",
            titulo: "¿Continuar?",
            url: "/api/producto/crear",
            data: getValues(),
            callback(res: any) {
                const formData = new FormData();
                imagenes.forEach((file) => {
                    formData.append("imagenes", file);
                });
                formData.append("productoId", res.id);

                fetch("/api/producto/imagenes", {
                    method: "POST",
                    body: formData,
                });
                router.replace("/dashboard/productos")
            }
        })
    };
    return (
        <Dialog onOpenChange={() => router.back()} defaultOpen >
            <DialogContent className="h-full">
                <Tabs className="overflow-y-scroll h-screen" onValueChange={value => setStep(+value)} value={step.toString()}>
                    <DialogHeader>
                        <DialogTitle>
                            Añadir producto
                        </DialogTitle>
                        <div className="border-b  bg-zinc-200 shadow-none dark:bg-zinc-900">
                            <TabsList className="p-2">
                                <TabsTrigger value={"1"}>
                                    {
                                        step == 1 ?
                                            <Loader className="animate-spin" /> : step > 1 ?
                                                <CircleCheck className="text-primary" /> :
                                                <Footprints />
                                    }
                                    Detalles
                                </TabsTrigger>
                                <TabsTrigger disabled={step < 2} value={"2"}>
                                    {
                                        step == 2 ?
                                            <Loader className="animate-spin" /> : step > 1 ?
                                                <CircleCheck className="text-primary" /> :
                                                <Footprints />
                                    }
                                    Organizar
                                </TabsTrigger>
                                <TabsTrigger disabled={step < 3} value={"3"}>
                                    {
                                        step == 3 ?
                                            <Loader className="animate-spin" /> : step > 3 ?
                                                <CircleCheck className="text-primary" /> :
                                                <Footprints />
                                    }
                                    Variantes
                                </TabsTrigger>
                            </TabsList>
                            <Button onClick={() => {
                                router.back();
                            }} className="absolute hover:!text-primary top-0 dark:inset-shadow-none rounded-none right-0 shadow-none  px-6" size='icon' variant='ghost'>
                                <X className="size-4" />
                            </Button>

                        </div>
                    </DialogHeader>
                    <TabsContent className="h-full " value="3">
                        <Variantes colores={colores}
                            tallas={tallas}
                            tallas2={tallas2} control={control} />
                    </TabsContent>
                    <div className="py-10 px-4 sm:px-14 md:px-16 lg:px-32 xl:px-100" >
                        <TabsContent value="1">
                            <Detalles
                                tallas={tallas}
                                tallas2={tallas2}
                                imagenes={imagenes}
                                setImagenes={setImagenes}
                                setTieneVariantes={setTieneVariantes}
                                tieneVariantes={tieneVariantes}
                                colores={colores}
                                setColores={setColores}
                                setTallas={setTallas}
                                setTallas2={setTallas2}
                                control={control} />
                        </TabsContent>
                        <TabsContent value="2">
                            <Organizar control={control} />
                        </TabsContent>

                    </div>

                </Tabs>

                <DialogFooter>
                    <Button onClick={() => {
                        if (step == 1)
                            router.back()
                        else
                            setStep(prev => prev - 1)
                    }} variant="outline">
                        {
                            step == 1 ?
                                "Cancelar" : "Regresar"
                        }
                    </Button>
                    <Button onClick={async () => {
                        if (step == 3) {
                            enviarDatos();
                        }
                        else {
                            if (await trigger(["titulo"])) {
                                if (imagenes.length > 0) {
                                    setStep(prev => prev + 1)
                                }
                                else {
                                    toast.error("Agregue por lo menos una imagen")
                                }
                            }
                        }
                    }}>
                        {
                            step == 3 ?
                                "Guardar" :
                                "Siguiente"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}