import { Button } from "@/components/ui/button";
import { ColorPickerButton } from "@/components/ui/colorpicker";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Check, Plus, Slash, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { SortableItem } from "./sortable-item";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormularioNuevoProducto, tallasAlfabeticas, tallasNumericas } from "@/lib/utils";

interface Props {
    form: UseFormReturn<FormularioNuevoProducto>;
    imagenes: File[];
    setImagenes: Dispatch<SetStateAction<File[]>>;
}

export default function Detalles({
    form,
    imagenes,
    setImagenes,
}: Props) {
    const { control, setValue, watch } = form;
    const [items, setItems] = useState<string[]>([]);
    const [enable, setEnable] = useState(false);

    const tieneVariantes = watch("tieneVariantes");
    const colores = watch("colores");
    const tallas = watch("tallas");
    const tallas2 = watch("tallas2");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const {
        control: colorControl,
        reset,
        handleSubmit,
    } = useForm<{ codigo: string, nombre: string }>({
        defaultValues: { codigo: "#FFF", nombre: "" }
    });

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);

            const updatedFiles = arrayMove(imagenes, oldIndex, newIndex);
            setImagenes(updatedFiles);
            setItems(updatedFiles.map(file => file.name));
        }
    }

    useEffect(() => {
        setItems(imagenes.map(value => value.name));
    }, [imagenes]);

    return (
        <div className="pb-10">
            <h3 className="font-semibold text-lg">Información general</h3>

            <div className="my-4 flex flex-col gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Controller
                    name="titulo"
                    rules={{ required: "No puede quedar vacío" }}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            placeholder="Chamarra de invierno"
                            error={!!fieldState.error}
                            errorText={fieldState.error?.message}
                        />
                    )}
                />

                <Label className="mt-2" htmlFor="subtitulo">Subtítulo (Opcional)</Label>
                <Controller
                    name="subtitulo"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Abrigador y esponjoso" />
                    )}
                />

                <Label className="mt-2" htmlFor="url">Manejador (Opcional)</Label>
                <Controller
                    name="url"
                    control={control}
                    render={({ field }) => (
                        <div className="relative">
                            <Input {...field} className="pl-12" placeholder="ruta-de-tu-producto" />
                            <div className="absolute top-0 left-0 h-full w-9 border-r flex items-center justify-center">
                                <Slash className="size-3 text-zinc-500" />
                            </div>
                        </div>
                    )}
                />

                <Label className="mt-2" htmlFor="descripcion">Descripción (Opcional)</Label>
                <Controller
                    name="descripcion"
                    control={control}
                    render={({ field }) => (
                        <Textarea {...field} rows={3} className="min-h-20" />
                    )}
                />

                <Label className="mt-8">Imágenes</Label>
                <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                            const nuevas = Array.from(files);
                            setImagenes(prev => [...prev, ...nuevas]);
                            setItems(prev => [...prev, ...nuevas.map(file => file.name)]);
                        }
                    }}
                />

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item, index) => (
                            <SortableItem
                                key={item}
                                id={item}
                                index={index}
                                file={imagenes.find(f => f.name === item)!}
                                setItems={setItems}
                                items={items}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                <Separator className="my-3" />

                <h3 className="font-semibold text-lg">Variantes</h3>
                <Card className={`p-3 flex-row ${tieneVariantes ? '!shadow-primary/50' : ''} items-center gap-4`}>
                    <Switch
                        checked={tieneVariantes}
                        onCheckedChange={(v) => setValue("tieneVariantes", v)}
                    />
                    <div>
                        <b className="text-sm">Sí, este producto tiene variantes</b>
                        <p className="text-sm">Cuando está desactivado, se creará una variante por defecto para ti</p>
                    </div>
                </Card>

                {tieneVariantes && (
                    <>
                        <div className="flex my-5 justify-between items-center">
                            <div>
                                <Label>Tallas del producto</Label>
                                <p className="text-sm">Define las tallas del producto ya sean por números o letras</p>
                            </div>
                        </div>

                        <ToggleGroup value={tallas} onValueChange={v => setValue("tallas", v)} type="multiple">
                            {tallasAlfabeticas.map((talla) => (
                                <ToggleGroupItem key={talla} value={talla}>
                                    {talla}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <ToggleGroup value={tallas2} onValueChange={v => setValue("tallas2", v)} type="multiple">
                            {tallasNumericas.map((talla) => (
                                <ToggleGroupItem key={talla} value={talla}>
                                    {talla}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <div className="flex my-5 justify-between items-center">
                            <div>
                                <Label>Colores del producto</Label>
                                <p className="text-sm">Define uno o más colores disponibles para este producto</p>
                            </div>
                            <Button disabled={enable} onClick={() => setEnable(true)} variant="outline">
                                <Plus className="size-4" /> Nuevo color
                            </Button>
                        </div>

                        {enable && (
                            <div className="flex flex-col gap-4 w-xs mx-auto">
                                <div className="flex gap-3 justify-center">
                                    <Button onClick={() => {
                                        setEnable(false);
                                        reset();
                                    }} variant="destructive" size="icon">
                                        <Trash className="size-4" />
                                    </Button>
                                    <Controller
                                        control={colorControl}
                                        name="codigo"
                                        render={({ field }) => (
                                            <ColorPickerButton color={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <Button
                                        onClick={handleSubmit(({ codigo, nombre }) => {
                                            const nuevos = [...(colores || []), { nombre, codigo }];
                                            setValue("colores", nuevos);
                                            setEnable(false);
                                            reset();
                                        })}
                                        variant="outline"
                                        size="icon"
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                </div>
                                <Controller
                                    control={colorControl}
                                    name="nombre"
                                    rules={{ required: "No puede quedar vacío" }}
                                    render={({ field, fieldState }) => (
                                        <Input {...field} error={!!fieldState.error} errorText={fieldState.error?.message} placeholder="Rojo, azul, verde" />
                                    )}
                                />
                            </div>
                        )}

                        <ul className="my-6 flex gap-4 flex-wrap">
                            {(colores || []).map((value) => (
                                <li className="flex flex-col items-center gap-2" key={value.codigo}>
                                    <Button
                                        size="icon"
                                        style={{ background: value.codigo }}
                                        className="rounded group relative"
                                        onClick={() => setValue("colores", colores.filter(c => c.codigo !== value.codigo))}
                                    >
                                        <X className="size-4 text-white bg-destructive opacity-0 group-hover:opacity-100 transition-all rounded duration-200" />
                                    </Button>
                                    <p className="text-sm font-semibold">{value.nombre}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
