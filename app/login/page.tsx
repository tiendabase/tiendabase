import { Button } from "@/components/ui/button";
import Navbar from "../componentes/navbar";
import { LoginForm } from "./login-form";
import Link from "next/link";

export const metadata = {
  title: 'Iniciar sesión'
}
export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
