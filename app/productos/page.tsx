"use client";
import Footer from "../componentes/footer";
import Navbar from "../componentes/navbar";
import Breadcrumb from "../producto/[id]/components/breadcrumb";
import ProductsFilter from "./componentes/products-filter";
import ProductsContent from "./products-content";


const Products = () => (
    <>
        <Navbar />
        <div className="mt-25 mb-8 px-5 sm:px-5 md:px-10  flex flex-col gap-3">
            <Breadcrumb />
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative ">
                <ProductsFilter />
                <ProductsContent />
            </div>
        </div>
        <Footer />
    </>
);

export default Products;
