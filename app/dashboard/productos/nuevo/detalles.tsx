import { Button } from "@/components/ui/button";
import {
    ColorPickerButton
} from "@/components/ui/colorpicker";
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
import { Imagen, Producto, Variante } from "@prisma/client";
import { Check, DotSquare, GripVertical, Move, Plus, Slash, Trash, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Control, Controller, useFieldArray, useForm } from "react-hook-form";
import { SortableItem } from "./sortable-item";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tallasAlfabeticas, tallasNumericas } from "@/lib/utils";
interface Props {
    control: Control<Producto & { imagenes: Imagen[], variantes: Variante[] }>;
    setColores: Dispatch<SetStateAction<{
        codigo: string;
        nombre: string;
    }[]>>;
    colores: { codigo: string, nombre: string }[];
    setTallas: any;
    imagenes: File[];
    setImagenes: Dispatch<SetStateAction<File[]>>;
    setTallas2: any;
    setTieneVariantes: any;
    tieneVariantes: boolean;
    tallas: string[];
    tallas2: string[];
}
export default function Detalles({ control,
    colores,
    setColores,
    setTallas,
    setTallas2,
    setTieneVariantes,
    tieneVariantes,
    imagenes,
    setImagenes,
    tallas,
    tallas2
}: Props) {
    const [enable, setEnable] = useState(false);
    const { control: colorControl, reset, handleSubmit } = useForm<{ codigo: string, nombre: string }>({ defaultValues: { codigo: "#FFF", nombre: "" } });
    const [items, setItems] = useState<string[]>([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                arrayMove(imagenes, oldIndex, newIndex);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
    useEffect(() => {
        setItems(imagenes.map(value => value.name))
    }, [imagenes])
    return (
        <div className="pb-10">
            <h3 className="font-semibold text-lg">
                Información general
            </h3>
            <div className="my-4 flex flex-col gap-2" >
                <Label htmlFor="titulo">
                    Título
                </Label>
                <Controller
                    name="titulo"
                    rules={{
                        required: "No puede quedar vacío"
                    }}
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            errorText={fieldState.error?.message}
                            error={!!fieldState.error}
                            placeholder="Chamarra de invierno" {...field} />
                    )} />
                <Label className="mt-2" htmlFor="subtitulo">
                    Subtítulo {"(Opcional)"}
                </Label>
                <Controller
                    name="subtitulo"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                            placeholder="Abrigador y esponjoso" {...field} />
                    )} />
                <Label className="mt-2" htmlFor="url">
                    Manejador {"(Opcional)"}
                </Label>
                <Controller
                    name="url"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="relative">
                            <Input
                                className="pl-12"
                                placeholder="ruta-de-tu-producto" {...field} />
                            <div className=" h-full w-9 border-r border-r flex items-center justify-center  absolute top-0">
                                <Slash className="size-3 text-zinc-500 " />
                            </div>
                        </div>
                    )} />
                <Label className="mt-2" htmlFor="descripcion">
                    Descripción {"(Opcional)"}
                </Label>
                <Controller
                    name="descripcion"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Textarea className="min-h-20"
                            {...field} rows={3} />

                    )} />
                <Label className="mt-8" htmlFor="descripcion">
                    Imágenes
                </Label>
                <Input
                    onChange={(ev) => {
                        const files = ev.target.files;
                        if (files) {
                            setImagenes(prev => [...prev, ...Array.from(files)]);
                            setItems(prev => [...prev, ...Array.from(files).map(file => file.name)]);
                        }
                    }}
                    accept="image/*"
                    type="file"
                    multiple
                    className="cursor-pointer"
                />
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item, index) => (
                            <SortableItem file={imagenes.find(value => value.name == item)!}
                                setItems={setItems}
                                index={index}
                                items={items} key={item} id={item} ></SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>

                <Separator className="my-3" />
                <h3 className="font-semibold text-lg">
                    Variantes
                </h3>
                <Card className={`p-3 flex-row ${tieneVariantes ? '!shadow-primary/50' : ''} items-center gap-4`}>
                    <Switch checked={tieneVariantes} onCheckedChange={setTieneVariantes} />
                    <div>
                        <b className="text-sm">
                            Sí, este producto tiene variantes
                        </b>
                        <p className="text-sm">
                            Cuando está desactivado, se creará una variante por defecto para tí
                        </p>
                    </div>
                </Card>

                {
                    tieneVariantes && (
                        <div className="">
                            <div className="flex my-5 justify-between items-center">
                                <div>
                                    <Label>Tallas del producto</Label>
                                    <p className="text-sm">
                                        Define las tallas del producto ya sean por números o letras
                                    </p>
                                </div>
                            </div>
                            <ToggleGroup
                                onValueChange={setTallas}
                                value={tallas}
                                type="multiple">
                                {tallasAlfabeticas.map((talla) => (
                                    <ToggleGroupItem key={talla} value={talla}>
                                        {talla}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>

                            <ToggleGroup
                                onValueChange={setTallas2}
                                value={tallas2} type="multiple">
                                {tallasNumericas.map((talla) => (
                                    <ToggleGroupItem key={talla} value={talla}>
                                        {talla}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                            <div className="flex my-5 justify-between items-center">
                                <div>
                                    <Label>Colores del producto</Label>
                                    <p className="text-sm">
                                        Define uno o más colores disponibles para este producto
                                    </p>
                                </div>
                                <Button disabled={enable}
                                    onClick={() => setEnable(true)} variant='outline'>
                                    <Plus className="size-4" /> Nuevo color
                                </Button>
                            </div>
                            {
                                enable && (
                                    <div className="flex flex-col gap-4 w-xs mx-auto">
                                        <div className="flex gap-3 justify-center">
                                            <Button onClick={() => {
                                                setEnable(false);
                                                reset()
                                            }}
                                                variant="destructive" size="icon" >
                                                <Trash className="size-4" />
                                            </Button>
                                            <Controller
                                                control={colorControl}
                                                name="codigo"
                                                render={({ field }) => (
                                                    <ColorPickerButton
                                                        color={field.value}
                                                        onChange={field.onChange} />
                                                )}
                                            />
                                            <Button onClick={handleSubmit(({ codigo, nombre }) => {
                                                setColores(prev => [...prev, { nombre, codigo }]);
                                                reset();
                                                setEnable(false);
                                            })} variant="outline" size="icon">
                                                <Check className="size-4" />
                                            </Button>
                                        </div>
                                        <Controller
                                            control={colorControl}
                                            name="nombre"
                                            rules={{ required: 'No puede quedar vacío' }}
                                            render={({ field, fieldState }) => (
                                                <Input
                                                    error={!!fieldState.error} errorText={fieldState.error?.message} {...field}
                                                    placeholder="Rojo, azul, verde" />
                                            )} />
                                    </div>
                                )
                            }
                            <ul className="my-6 flex gap-4 flex-wrap">
                                {colores.map((value) => (
                                    <li className="flex flex-col items-center gap-2" key={value.codigo}>
                                        <Button
                                            size="icon"
                                            style={{ background: value.codigo }}
                                            className="rounded group relative"
                                            onClick={() => {
                                                setColores(prev => prev.filter(hex => hex.codigo != value.codigo))
                                            }}
                                        >
                                            <X className="size-4 text-white bg-destructive opacity-0 group-hover:opacity-100 transition-all rounded duration-200" />
                                        </Button>
                                        <p className="text-sm font-semibold">{value.nombre}</p>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    )
                }

            </div>
        </div>
    )
}