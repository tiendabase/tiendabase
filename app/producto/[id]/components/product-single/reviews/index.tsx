import type { ProductType } from "@/types";

import Punctuation from "./punctuation";
import ReviewsList from "./reviews-list";
import { Producto } from "@prisma/client";

type ReviewsProductType = {
  show: boolean;
  producto: Producto;
};

const Reviews = ({ show, producto }: ReviewsProductType) => {
  const style = {
    display: show ? "flex" : "none",
  };

  return (
    <section style={style} className="product-single__reviews">
      
    </section>
  );
};

export default Reviews;
