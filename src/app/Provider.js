"use client"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";


export default function Provider({ children }) {
    const [queryClient] = useState(() => new QueryClient());
    return(
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    )
}