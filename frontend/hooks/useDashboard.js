import { useQuery } from 'react-query'
import { dashboardAPI, warehousesAPI } from '@/services/api'

// Dashboard KPIs
export const useDashboardKPIs = (warehouseId = null) => {
  return useQuery(
    ['dashboard', 'kpis', warehouseId],
    () => dashboardAPI.getKPIs(warehouseId).then(res => res.data.data),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

// Stock by Category
export const useStockByCategory = (warehouseId = null) => {
  return useQuery(
    ['dashboard', 'stock-by-category', warehouseId],
    () => dashboardAPI.getStockByCategory(warehouseId).then(res => res.data.data),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      enabled: true, // Always enabled
    }
  )
}

// Stock History
export const useStockHistory = (warehouseId = null, days = 30) => {
  return useQuery(
    ['dashboard', 'stock-history', warehouseId, days],
    () => dashboardAPI.getStockHistory(warehouseId, days).then(res => res.data.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
    }
  )
}

// Warehouse Distribution
export const useWarehouseStockDistribution = () => {
  return useQuery(
    ['dashboard', 'warehouse-distribution'],
    () => dashboardAPI.getWarehouseStockDistribution().then(res => res.data.data),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

// Top Products
export const useTopProducts = (warehouseId = null, limit = 10) => {
  return useQuery(
    ['dashboard', 'top-products', warehouseId, limit],
    () => dashboardAPI.getTopProducts(warehouseId, limit).then(res => res.data.data),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

// Warehouses
export const useWarehouses = () => {
  return useQuery(
    ['warehouses'],
    () => warehousesAPI.getAll().then(res => res.data.data),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes - warehouses don't change often
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}

