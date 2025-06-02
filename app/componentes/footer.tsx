import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Descripción de la marca */}
          <div className="lg:col-span-2">
            <h6 className="text-2xl font-bold mb-4">
              <span className="text-primary">E</span>
              -Shop
            </h6>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
              House My Brand diseña ropa para jóvenes, adultos y todos los que están en el medio, pero lo más
              importante, para los amantes de la moda.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Enlaces de compras */}
          <div>
            <h6 className="text-lg font-semibold mb-4 text-primary">Compras Online</h6>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Estado del Pedido
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Envío y Entrega
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Opciones de Pago
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces de información */}
          <div>
            <h6 className="text-lg font-semibold mb-4 text-primary">Información</h6>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Tarjetas de Regalo
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Encuentra una Tienda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Hazte Miembro
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Comentarios del Sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="text-lg font-semibold mb-4 text-primary">Contacto</h6>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-primary" />
                  <Link
                    href="mailto:tienda@eshop.com"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    tienda@eshop.com
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-primary" />
                  <Link
                    href="tel:+1131138138"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Línea directa: +1 131 138 138
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h6 className="text-lg font-semibold mb-4 text-primary">Suscríbete</h6>
              <p className="text-muted-foreground text-sm mb-3">
                Recibe las últimas noticias sobre moda y ofertas exclusivas
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-4 py-2 bg-secondary border border-input rounded-l-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-r-[var(--radius)] hover:bg-primary/90 transition-all duration-300">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">Diseñado por Miguel Huayhua - 2025</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                Política de Privacidad
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                Términos de Uso
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
