"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CircleCheck, Footprints, Loader, X } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@/providers/modalprovider";
import Detalles from "./detalles";
import Organizar from "./organizar";
import Variantes from "./variantes";
import { FormularioNuevoProducto } from "@/lib/utils";

const STEPS = {
    DETALLES: 1,
    ORGANIZAR: 2,
    VARIANTES: 3
} as const;

const StepIcon = ({ currentStep, targetStep }: { currentStep: number; targetStep: number }) => {
    if (currentStep === targetStep) return <Loader className="animate-spin" />;
    if (currentStep > targetStep) return <CircleCheck className="text-primary" />;
    return <Footprints />;
};

export default function CrearProducto() {
    const router = useRouter();
    const { openModal } = useModal();
    const [step, setStep] = useState<number>(STEPS.DETALLES);
    const [imagenes, setImagenes] = useState<File[]>([]);

    const form = useForm<FormularioNuevoProducto>({
        mode: "onChange",
        defaultValues: {
            titulo: "",
            descripcion: "",
            subtitulo: "",
            url: "",
            descontable: false,
            colores: [],
            tallas: [],
            tallas2: [],
            tieneVariantes: false,
            variantes: [],
        }
    });

    const { handleSubmit, trigger, watch } = form;

    const handleBack = () => {
        step === STEPS.DETALLES ? router.back() : setStep(prev => prev - 1);
    };

    const handleNext = useCallback(async () => {
        if (step === STEPS.VARIANTES) {
            await handleSubmit(enviarDatos)();
            return;
        }

        const isValid = await trigger(["titulo"]);

        if (!isValid) return;

      

        setStep(prev => prev + 1);
    }, [step, imagenes, handleSubmit, trigger]);

    const enviarDatos = async (data: FormularioNuevoProducto) => {
        console.log(data)
        openModal({
            titulo: "¿Continuar?",
            content: "Se agregará un nuevo producto",
            url: "/api/producto/crear",
            data,
            callback: async (res: any) => {
                if (imagenes.length > 0) {
                    const formData = new FormData();
                    imagenes.forEach(file => formData.append("imagenes", file));
                    formData.append("productoId", res.id);

                    await fetch("/api/producto/imagenes", {
                        method: "POST",
                        body: formData
                    });
                }

                router.replace("/dashboard/productos");
            }
        });
    };

    const handleTabChange = (value: string) => {
        const newStep = parseInt(value);
        if (newStep <= step) setStep(newStep);
    };

    return (
        <Dialog onOpenChange={() => router.back()} defaultOpen>
            <DialogContent className="h-full">
                <Tabs value={step.toString()} onValueChange={handleTabChange} className="overflow-y-scroll h-screen">
                    <DialogHeader>
                        <DialogTitle>Añadir producto</DialogTitle>
                        <div className="border-b bg-zinc-200 shadow-none dark:bg-zinc-900">
                            <TabsList className="p-2">
                                <TabsTrigger value={STEPS.DETALLES.toString()}>
                                    <StepIcon currentStep={step} targetStep={STEPS.DETALLES} />
                                    Detalles
                                </TabsTrigger>
                                <TabsTrigger value={STEPS.ORGANIZAR.toString()} disabled={step < STEPS.ORGANIZAR}>
                                    <StepIcon currentStep={step} targetStep={STEPS.ORGANIZAR} />
                                    Organizar
                                </TabsTrigger>
                                <TabsTrigger value={STEPS.VARIANTES.toString()} disabled={step < STEPS.VARIANTES}>
                                    <StepIcon currentStep={step} targetStep={STEPS.VARIANTES} />
                                    Variantes
                                </TabsTrigger>
                            </TabsList>
                            <Button
                                onClick={() => router.back()}
                                className="absolute hover:!text-primary top-0 dark:inset-shadow-none rounded-none right-0 shadow-none px-6"
                                size="icon"
                                variant="ghost"
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    {/* Contenido de Tabs */}
                    <div className="py-10 pb-22  px-4 sm:px-14 md:px-16 lg:px-32 xl:px-100">
                        <TabsContent value={STEPS.DETALLES.toString()}>
                            <Detalles form={form} imagenes={imagenes} setImagenes={setImagenes} />
                        </TabsContent>

                        <TabsContent value={STEPS.ORGANIZAR.toString()}>
                            <Organizar form={form} />
                        </TabsContent>
                    </div>

                    <TabsContent value={STEPS.VARIANTES.toString()} className="h-full">
                        <Variantes form={form} />
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button onClick={handleBack} variant="secondary">
                        {step === STEPS.DETALLES ? "Cancelar" : "Regresar"}
                    </Button>
                    <Button  onClick={handleNext}>
                        {step === STEPS.VARIANTES ? "Guardar" : "Siguiente"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
