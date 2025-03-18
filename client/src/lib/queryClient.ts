// API client for making requests to the backend
// This is optimized for Netlify Functions

/**
 * Make a request to the API
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`API Response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request Error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Helper function to get a query function for React Query
 */
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  endpoint: string;
}) => () => Promise<T | null> = ({ on401, endpoint }) => {
  return async () => {
    try {
      return await apiRequest(endpoint);
    } catch (e) {
      if (e instanceof Response && e.status === 401) {
        if (on401 === "throw") throw e;
        return null;
      }
      throw e;
    }
  };
};

// Import for React Query setup if needed
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
