'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'

export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnMount: false, // Don't refetch on component mount if data exists
            refetchOnReconnect: false, // Don't refetch on reconnect
            retry: 1, // Retry failed requests once
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

