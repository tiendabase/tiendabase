'use client';
import React, { ReactElement, createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// Creamos un contexto para almacenar el estado del Snackbar
const ModalContext = createContext({
    openModal: (
        params: {
            content: ReactElement | string,
            url: string,
            data?: any,
            titulo: string,
            ButtonText?: { yes: string, no: string },
            hasBack?: boolean;
            callback?: Function,
            replace: string
        }
    ) => {
    }
});
export const ModalProvider = ({ children }: any) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [action, setAction] = useState<{
        params: {
            content: ReactElement | string,
            url: string,
            data?: any,
            titulo: string,
            ButtonText?: { yes: string, no: string },
            hasBack?: boolean,
            callback?: Function,
            replace: string
        }
    }>({
        params:
        {
            content: <></>,
            url: '',
            data: {},
            titulo: '',
            ButtonText: { yes: 'Aceptar', no: 'Cancelar' },
            hasBack: false,
            callback: () => { },
            replace: ''
        }
    });
    const openModal = (params: typeof action.params) => {
        setAction({ params: { ...action.params, ...params } });
        setOpen(true);
    };


    return (
        <ModalContext.Provider value={{ openModal }}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {action.params.titulo}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {
                                action.params.content
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {action.params.ButtonText?.no}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                const { data, url, callback } = action.params;
                                try {
                                    toast.promise(fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(data),
                                    }).then(res => res.json()), {
                                        success(res) {
                                            if (callback) {
                                                callback(res);
                                                setOpen(false);
                                            }
                                            return res.message ?? "Realizado con éxito"
                                        },
                                        error(res) {
                                            return res.message ?? "Ha ocurrido un error"
                                        }
                                    })


                                } catch (error) {
                                    toast.error("Error en la petición");
                                }
                            }}
                        >
                            {action.params.ButtonText?.yes}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </ModalContext.Provider>
    );
};

// Hook para consumir el contexto del Snackbar en cualquier componente
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal debe ser usado dentro de un ModalProvider');
    }

    return context;
};