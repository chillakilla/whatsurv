'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const ProvidersLayout = ({children}: Props) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ProvidersLayout;
