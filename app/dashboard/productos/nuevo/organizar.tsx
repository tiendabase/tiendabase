import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Imagen, Producto, Variante } from "@prisma/client";
import { Control, Controller } from "react-hook-form";

interface Props {
    control: Control<Producto & { imagenes: Imagen[], variantes: Variante[] }>;
}
export default function Organizar({ control }: Props) {
    return (
        <>
            <h3 className="font-semibold text-lg">
                Organizar
            </h3>
            <div className="my-4 flex flex-col gap-2" >
                <Controller
                    control={control}
                    name="descontable"
                    render={({ field }) => (
                        <Card className={`p-3 flex-row ${field.value ? '!shadow-primary/50' : ''} items-center gap-4`}>
                            <Switch onCheckedChange={field.onChange} />
                            <div>
                                <b className="text-sm">
                                    Descontable {"(Opcional)"}
                                </b>
                                <p className="text-sm">
                                    Cuando está desactivado, los descuentos no se aplicarán a este producto.
                                </p>
                            </div>
                        </Card>
                    )}
                />
            </div>
        </>
    )
}