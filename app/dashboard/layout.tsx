
import { cookies } from "next/headers";
import { Metadata } from "next";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./componentes/app-sidebar";
import { Separator } from "@/components/ui/separator";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ThemeProvider } from "@/providers/theme-provider";
import { ModalProvider } from "@/providers/modalprovider";
export const metadata: Metadata = {
    title: 'Dashboard'
}

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <ThemeProvider attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset >

                        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">
                                                Building Your Application
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>
                        <ModalProvider>
                            {
                                <div className="p-4">
                                    {children}
                                </div>
                            }
                        </ModalProvider>
                    </SidebarInset>
                </SidebarProvider>
            </ThemeProvider>
        </>
    )
}