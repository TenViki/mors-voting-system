"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";

const queryClient = new QueryClient();

interface QueryClientContextProps {
  children: React.ReactNode;
}

const QueryClientContext: FC<QueryClientContextProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientContext;
