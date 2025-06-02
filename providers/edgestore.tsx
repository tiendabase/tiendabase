'use client';

import { EdgeStoreRouter } from '@/app/api/edgestore/[...edgestore]/edgestore-server';
import { createEdgeStoreProvider } from '@edgestore/react';

const { EdgeStoreProvider, useEdgeStore } =
    createEdgeStoreProvider<EdgeStoreRouter>();
export { EdgeStoreProvider, useEdgeStore };