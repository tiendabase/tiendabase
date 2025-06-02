import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Truck } from "lucide-react";

type CheckoutStatusProps = {
  step: string;
};

const CheckoutStatus = ({ step }: CheckoutStatusProps) => {
  return (
    <div className="flex  gap-2 items-center h-[2em]">
      <div className={`${step === "cart" ? "bg-primary text-white p-2 rounded-full" : "border border-primary p-2 rounded-full text-primary"}`}>
        <ShoppingCart className="size-4" />
      </div>
      <Separator orientation="vertical" />
      <div className={`${step === "checkout" ? "bg-primary text-white p-2 rounded-full" : "border border-primary p-2 rounded-full text-primary"}`}>
        <Truck className="size-4" />
      </div>
    </div>

  );
};

export default CheckoutStatus;
