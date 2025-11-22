'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import KPICard from '@/components/KPICard'
import PieChart from '@/components/charts/PieChart'
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import {
  useDashboardKPIs,
  useWarehouses,
  useWarehouseStockDistribution,
  useStockByCategory,
  useStockHistory,
  useTopProducts,
} from '@/hooks/useDashboard'

export default function DashboardPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [user, setUser] = useState(null)

  // Fetch data using React Query (cached)
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs()
  const { data: warehouses = [], isLoading: warehousesLoading } = useWarehouses()
  const { data: warehouseDistribution = [] } = useWarehouseStockDistribution()

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      // If warehouse staff, set their warehouse as selected
      if (parsedUser.role === 'WAREHOUSE_STAFF' && parsedUser.warehouseId) {
        setSelectedWarehouse(parsedUser.warehouseId)
      }
    }
  }, [])

  // Calculate derived values
  const isManager = user?.role === 'MANAGER'
  const warehousesToShow = isManager 
    ? warehouses 
    : (user?.warehouseId ? warehouses.filter(w => w.id === user.warehouseId) : [])

  const loading = kpisLoading || warehousesLoading

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {isManager && warehouses.length > 0 && (
            <select
              value={selectedWarehouse || 'all'}
              onChange={(e) => setSelectedWarehouse(e.target.value === 'all' ? null : e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Warehouses</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>{wh.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Total Products"
            value={kpis?.totalProducts || 0}
            color="blue"
          />
          <KPICard
            title="Total Warehouses"
            value={kpis?.totalWarehouses || 0}
            color="green"
          />
          <KPICard
            title="Pending Documents"
            value={kpis?.pendingDocuments?.total || 0}
            color="yellow"
          />
          <KPICard
            title="Low Stock Items"
            value={kpis?.lowStockItems?.length || 0}
            color="red"
          />
        </div>

        {/* Charts Section */}
        {isManager ? (
          // Manager View: Show charts for each warehouse
          <>
            {warehouses.map((warehouse) => (
              <WarehouseChartsSection
                key={warehouse.id}
                warehouse={warehouse}
              />
            ))}
            
            {/* Overall Warehouse Distribution */}
            {warehouseDistribution.length > 0 && (
              <div className="mb-8">
                <PieChart
                  data={warehouseDistribution}
                  title="Stock Distribution Across All Warehouses"
                  dataKey="value"
                  nameKey="name"
                />
              </div>
            )}
          </>
        ) : (
          // Warehouse Staff View: Show charts for their warehouse only
          warehousesToShow.length > 0 && (
            <WarehouseChartsSection
              warehouse={warehousesToShow[0]}
            />
          )
        )}

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Documents</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Receipts:</span>
                <span className="font-medium">{kpis?.pendingDocuments?.receipts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deliveries:</span>
                <span className="font-medium">{kpis?.pendingDocuments?.deliveries || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transfers:</span>
                <span className="font-medium">{kpis?.pendingDocuments?.transfers || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Low Stock Items</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {kpis?.lowStockItems?.length > 0 ? (
                kpis.lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.warehouse.name}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600">{item.quantity} {item.product.uom}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No low stock items</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Component for warehouse-specific charts
function WarehouseChartsSection({ warehouse }) {
  const { data: stockByCategory = [], isLoading: categoryLoading } = useStockByCategory(warehouse?.id)
  const { data: stockHistory = [], isLoading: historyLoading } = useStockHistory(warehouse?.id, 30)
  const { data: topProducts = [], isLoading: productsLoading } = useTopProducts(warehouse?.id, 10)

  const loading = categoryLoading || historyLoading || productsLoading

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{warehouse.name}</h2>
        <p className="text-gray-500">Loading charts...</p>
      </div>
    )
  }

  const categoryData = stockByCategory.map(item => ({
    name: item.category,
    value: item.quantity
  }))

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{warehouse.name} - {warehouse.location}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stock by Category Pie Chart */}
        {categoryData.length > 0 && (
          <PieChart
            data={categoryData}
            title={`Stock by Category - ${warehouse.name}`}
            dataKey="value"
            nameKey="name"
          />
        )}

        {/* Stock History Line Chart */}
        {stockHistory.length > 0 && (
          <LineChart
            data={stockHistory}
            title={`Stock History (Last 30 Days) - ${warehouse.name}`}
            dataKeys={['totalIn', 'totalOut', 'netChange']}
          />
        )}
      </div>

      {/* Top Products Bar Chart */}
      {topProducts.length > 0 && (
        <div className="mb-6">
          <BarChart
            data={topProducts.map(p => ({
              name: p.productName,
              value: p.quantity
            }))}
            title={`Top 10 Products by Stock - ${warehouse.name}`}
            dataKey="value"
            nameKey="name"
          />
        </div>
      )}
    </div>
  )
}
