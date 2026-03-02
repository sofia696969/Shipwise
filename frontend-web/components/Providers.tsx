'use client';

import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient | null>(null);

  // Initialize QueryClient only once
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
