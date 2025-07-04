'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from 'sonner'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, SendToBack } from "lucide-react"
import { signIn } from "next-auth/react";
import React from "react";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [load, setLoad] = React.useState(false);
    return (
        <>
            <Button
                variant='outline'
                className="fixed top-5 left-5" onClick={() => router.back()}>
                <ArrowLeft className="size-4" />  Regresar
            </Button>
            <div className={cn("flex flex-col gap-6", className)} {...props}>

                <Card className="overflow-hidden py-0">
                    <CardContent className="grid m-0 p-0 md:grid-cols-2">
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            setLoad(true);
                            const formData = new FormData(event.currentTarget);
                            const email = formData.get('email') as string;
                            const password = formData.get('password') as string;
                            signIn('credentials', {
                                redirect: false,
                                callbackUrl: '/dashboard',
                                email,
                                password
                            }).then((result) => {
                                if (result!.ok) {
                                    toast.success("Iniciaste sesión correctamente");
                                    setLoad(false);
                                    router.push(result!.url || '/dashboard');
                                }
                                else {
                                    toast.error("Error al iniciar sesión, verifica tus credenciales");
                                    setLoad(false);
                                    router.push('/login')
                                }
                            })

                        }} >
                            <div className="flex flex-col gap-6 p-8">
                                <div className="flex flex-col items-center text-center ">
                                    <h1 className="text-2xl font-bold">
                                        Bienvenido de nuevo
                                    </h1>
                                    <p className="text-balance text-muted-foreground">
                                       Inicia sesión en tu cuenta de Moces-K
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        name="email"
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <a
                                            href="#"
                                            className="ml-auto text-sm underline-offset-2 hover:underline"
                                        >
                                           ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                    <Input
                                        name="password"
                                        id="password"type="password" required />
                                </div>
                                <Button
                                    disabled={load}
                                    type="submit"

                                    className="w-full">
                                    {
                                        load && <Loader2 className="mr-2 size-4 animate-spin" />
                                    }
                                    {
                                        load ?
                                            <span>
                                                Iniciando sesión
                                            </span> :
                                            <span>
                                                Iniciar sesión
                                            </span>
                                    }
                                </Button>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        O continua con
                                    </span>
                                </div>

                                <Button variant="outline"
                                    className="w-full">
                                    <svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>

                                    <span>
                                        Iniciar sesión con Google
                                    </span>
                                </Button>

                                <div className="text-center text-sm">
                                    ¿No tienes una cuenta?{" "}
                                    <a href="#" className="underline underline-offset-4">
                                        Regístrate
                                    </a>
                                </div>
                            </div>
                        </form>
                        <div className="relative 
                     hidden bg-muted md:block">
                            <Image
                                layout="fill"
                                src='/landscape.jpg'
                                alt="Background Image"
                                className=" inset-0 object-cover   
                             brightness-[0.7] dark:grayscale"
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                    Al presionar continuar estás de acuerdo con nuestros<a href="#"> términos o condiciones</a>{" "}
                    y nuestra <a href="#">Política de privacidad</a>.
                </div>
            </div>
        </>

    )
}
