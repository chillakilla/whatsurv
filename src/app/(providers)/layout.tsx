'use client';
import {NextUIProvider} from '@nextui-org/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const ProvidersLayout = ({children}: Props) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <NextUIProvider>{children}</NextUIProvider>
    </QueryClientProvider>
  );
};

export default ProvidersLayout;
