import { useQuery, useMutation, useQueryClient } from 'react-query'
import { productsAPI } from '@/services/api'

// Get all products
export const useProducts = (filters = {}) => {
  return useQuery(
    ['products', filters],
    () => productsAPI.getAll(filters).then(res => res.data.data),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

// Get product by ID
export const useProduct = (id) => {
  return useQuery(
    ['products', id],
    () => productsAPI.getById(id).then(res => res.data.data),
    {
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      enabled: !!id, // Only fetch if ID exists
    }
  )
}

// Get product stock levels
export const useProductStockLevels = (id) => {
  return useQuery(
    ['products', id, 'stock-levels'],
    () => productsAPI.getStockLevels(id).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000, // 1 minute - stock changes frequently
      cacheTime: 3 * 60 * 1000,
      enabled: !!id,
    }
  )
}

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (data) => productsAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }) => productsAPI.update(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['products'])
        queryClient.invalidateQueries(['products', variables.id])
      },
    }
  )
}

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id) => productsAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

