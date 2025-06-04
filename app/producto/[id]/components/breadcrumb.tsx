import { Home } from "lucide-react";

const Breadcrumb = () => (
  <section className="m-6 mb-3 md:m-0 md:ml-10 md:mb-2">
    <div className="container">
      <ul className="flex text-sm items-center gap-2">
        <li>
          <a href="#">
            <Home className="size-4"/>
          </a>
        </li>
        <li>
          /
        </li>
        <li>All Products</li>
      </ul>
    </div>
  </section>
);

export default Breadcrumb;
