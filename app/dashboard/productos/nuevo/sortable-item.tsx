import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';
import Image from 'next/image';
interface Props {
    file: File;
    id: string;
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
    items: string[];
    index: number;
}
export function SortableItem({ file, index, items, id, setItems }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div {...attributes} style={style} >
            <Card key={file.name} id={file.name} className="py-2 px-3 flex-row items-center justify-between ">
                <div className='flex gap-4'>
                    <div className="flex items-center gap-2">
                        <Button ref={setNodeRef}  {...listeners} type='button' variant="ghost" className='cursor-grab'>
                            <GripVertical className="size-4 opacity-50" />
                        </Button>
                        <div className="w-8 h-12 relative">
                            <Image
                                alt={file.name}
                                src={URL.createObjectURL(file)}
                                fill
                                objectFit="cover"
                                className="rounded"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className="text-xs font-semibold ">{file.name}</span>
                        <span className="text-xs text-gray-400 font-semibold">
                            {
                                file.size > 1024 * 1024 ?
                                    `${(file.size / (1024 * 1024)).toFixed(2)} MB` :
                                    `${(file.size / 1024).toFixed(2)} KB`
                            }
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <Card className={`h-6 w-6 py-0 flex font-semibold items-center justify-center text-xs ${index == 0 && "bg-primary text-white"}`}>
                        {index + 1}
                    </Card>
                    <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => {

                            setItems(items.filter((item) => item != id));

                        }}
                        className="hover:text-primary "
                    >
                        <X className='size-4' />
                    </Button>
                </div>
            </Card>
        </div>
    );
}