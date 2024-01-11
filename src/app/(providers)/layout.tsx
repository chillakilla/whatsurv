'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const ProvidersLayout = ({children}: Props) => {
  const client = new QueryClient();
<<<<<<< HEAD
  return (
    <QueryClientProvider client={client}>
      <NextUIProvider>{children}</NextUIProvider>
    </QueryClientProvider>
  );
=======
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
>>>>>>> 527eb3c3b7469f99aea75ddd46d1de338b4a07ea
};

export default ProvidersLayout;
