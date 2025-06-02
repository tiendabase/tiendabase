"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"

const data = [
    {
        goal: 400,
    },
    {
        goal: 300,
    },
    {
        goal: 200,
    },
    {
        goal: 300,
    },
    {
        goal: 200,
    },
    {
        goal: 278,
    },
    {
        goal: 189,
    },
    {
        goal: 239,
    },
    {
        goal: 300,
    },
    {
        goal: 200,
    },
    {
        goal: 278,
    },
    {
        goal: 189,
    },
    {
        goal: 349,
    },
]

export function ResponsiveNavbar(children: any) {
    const [goal, setGoal] = React.useState(350)

    function onClick(adjustment: number) {
        setGoal(Math.max(200, Math.min(400, goal + adjustment)))
    }

    return (
        <Drawer direction="right" >
            {children.children}
            <DrawerContent>
                <div className=" max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>
                            Menú
                        </DrawerTitle>
                    </DrawerHeader>

                    <nav
                        className="flex p-6 flex-col gap-4"
                    >
                        <Link href="/products">Products</Link>
                        <Link href="#">Inspiration</Link>
                        <Link href="#">Blog</Link>

                    </nav>


                    <DrawerFooter>
                        <Button>
                            <Link href='/login'>
                                Iniciar sesión
                            </Link>
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Registrarme</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
