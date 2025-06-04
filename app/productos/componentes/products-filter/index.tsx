import { useState } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import CheckboxColor from "./form-builder/checkbox-color";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DualRangeSlider } from "@/components/ui/dual-range";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tallasAlfabeticas, tallasNumericas } from "@/lib/utils";


const ProductsFilter = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const addQueryParams = () => {
    // query params changes
  };
  const FilterForm = () => (
    <form className="w-full sticky  z-10  md:w-3xs" onChange={addQueryParams}>
      <div>
        <h4 className="font-bold">
          Categoría
        </h4>
        <div className="p-2 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Checkbox />
            <label htmlFor="">Polar</label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox />
            <label htmlFor="">Polar</label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox />
            <label htmlFor="">Polar</label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox />
            <label htmlFor="">Polar</label>
          </div>
        </div>
      </div>
      <Separator className="my-3" />
      <h4 className="font-bold">
        Precio
      </h4>
      <div className="my-8">
        <DualRangeSlider label={(value) => value}
          value={[0, 100]}
          min={0}
          max={100}
          step={1} />
      </div>
      <Separator className="my-3" />
      <div className="">
        <h4 className="font-bold">
          Tallas
        </h4>
        <ToggleGroup
          orientation="vertical"
          type="multiple">
          {tallasAlfabeticas.map((talla) => (
            <ToggleGroupItem key={talla} value={talla}>
              {talla}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          type="multiple">
          {tallasNumericas.map((talla) => (
            <ToggleGroupItem key={talla} value={talla}>
              {talla}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Button className="w-full">
        Aplicar filtros</Button>
      <Button className="w-full mt-4" variant="outline">
        Limpiar filtros
      </Button>


    </form>
  )
  return (
    <>
      <Sheet >

        <SheetContent >
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>

          </SheetHeader>
          <div className="px-6">
            <FilterForm />
          </div>

        </SheetContent>


        <SheetTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className={`flex text-xs  sticky top-16 z-50 border-y rounded-none md:hidden w-full`}
          >
            Agregar filtro <ChevronRight className="size-4" />
          </Button>
        </SheetTrigger>
        <Card
          className={`hidden md:flex p-4`}
        >
          <FilterForm />
        </Card>
      </Sheet>

    </>
  );
};

export default ProductsFilter;
