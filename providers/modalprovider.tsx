'use client';
import React, { ReactElement, createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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
        }
    ) => {
    }
});
export const ModalProvider = ({ children }: any) => {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<{
        params: {
            content: ReactElement | string,
            url: string,
            data?: any,
            titulo: string,
            ButtonText?: { yes: string, no: string },
            hasBack?: boolean,
            callback?: Function,
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
            callback: () => { }
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
                        <AlertDialogTitle className='text-center'>
                            {action.params.titulo}
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-center py-3'>
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
                                    toast.promise(
                                        fetch(url, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(data),
                                        }).then(async (res) => {
                                            const responseData = await res.json();

                                            // Si el status HTTP indica error, lanzar excepción
                                            if (!res.ok) {
                                                throw new Error(responseData.message || "Ha ocurrido un error");
                                            }

                                            // Si la respuesta contiene un campo 'error', también es un error
                                            if (responseData.error) {
                                                throw new Error(responseData.message || responseData.error || "Ha ocurrido un error");
                                            }

                                            return responseData;
                                        }),
                                        {
                                            loading: 'Procesando...',
                                            success: (res) => {
                                                if (callback) {
                                                    callback(res);
                                                }
                                                setOpen(false);
                                                return res.message || "Realizado con éxito";
                                            },
                                            error: (error) => {
                                                return error.message || "Ha ocurrido un error";
                                            }
                                        }
                                    );
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