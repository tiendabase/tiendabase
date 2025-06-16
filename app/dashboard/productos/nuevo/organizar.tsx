import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FormularioNuevoProducto } from "@/lib/utils";
import { Control, Controller, UseFormReturn } from "react-hook-form";

interface Props {
    form: UseFormReturn<FormularioNuevoProducto>
}
export default function Organizar({ form }: Props) {
    const {control} = form;
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