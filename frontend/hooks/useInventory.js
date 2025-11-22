import { useQuery, useMutation, useQueryClient } from 'react-query'
import { receiptsAPI, deliveriesAPI, transfersAPI, adjustmentsAPI } from '@/services/api'

// Receipts
export const useReceipts = (filters = {}) => {
  return useQuery(
    ['receipts', filters],
    () => receiptsAPI.getAll(filters).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
      cacheTime: 3 * 60 * 1000,
    }
  )
}

export const useReceipt = (id) => {
  return useQuery(
    ['receipts', id],
    () => receiptsAPI.getById(id).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
      enabled: !!id,
    }
  )
}

export const useCreateReceipt = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (data) => receiptsAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['receipts'])
        queryClient.invalidateQueries(['dashboard'])
      },
    }
  )
}

export const useValidateReceipt = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (id) => receiptsAPI.validate(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['receipts'])
        queryClient.invalidateQueries(['dashboard'])
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

// Deliveries
export const useDeliveries = (filters = {}) => {
  return useQuery(
    ['deliveries', filters],
    () => deliveriesAPI.getAll(filters).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
    }
  )
}

export const useDelivery = (id) => {
  return useQuery(
    ['deliveries', id],
    () => deliveriesAPI.getById(id).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
      enabled: !!id,
    }
  )
}

export const useCreateDelivery = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (data) => deliveriesAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['deliveries'])
        queryClient.invalidateQueries(['dashboard'])
      },
    }
  )
}

export const useValidateDelivery = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (id) => deliveriesAPI.validate(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['deliveries'])
        queryClient.invalidateQueries(['dashboard'])
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

// Transfers
export const useTransfers = (filters = {}) => {
  return useQuery(
    ['transfers', filters],
    () => transfersAPI.getAll(filters).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
    }
  )
}

export const useTransfer = (id) => {
  return useQuery(
    ['transfers', id],
    () => transfersAPI.getById(id).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
      enabled: !!id,
    }
  )
}

export const useCreateTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (data) => transfersAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transfers'])
        queryClient.invalidateQueries(['dashboard'])
      },
    }
  )
}

export const useValidateTransfer = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (id) => transfersAPI.validate(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transfers'])
        queryClient.invalidateQueries(['dashboard'])
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

// Adjustments
export const useAdjustments = (filters = {}) => {
  return useQuery(
    ['adjustments', filters],
    () => adjustmentsAPI.getAll(filters).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
    }
  )
}

export const useAdjustment = (id) => {
  return useQuery(
    ['adjustments', id],
    () => adjustmentsAPI.getById(id).then(res => res.data.data),
    {
      staleTime: 1 * 60 * 1000,
      cacheTime: 3 * 60 * 1000,
      enabled: !!id,
    }
  )
}

export const useCreateAdjustment = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (data) => adjustmentsAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['adjustments'])
        queryClient.invalidateQueries(['dashboard'])
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

