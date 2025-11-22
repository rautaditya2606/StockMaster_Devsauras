'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import { adjustmentsAPI } from '@/services/api'
import { useRouter } from 'next/navigation'

export default function AdjustmentsPage() {
  const router = useRouter()
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdjustments()
  }, [])

  const fetchAdjustments = async () => {
    try {
      const response = await adjustmentsAPI.getAll()
      setAdjustments(response.data.data)
    } catch (error) {
      console.error('Failed to fetch adjustments:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'product', label: 'Product', render: (value, row) => row.product?.name || '-' },
    { key: 'warehouse', label: 'Warehouse', render: (value, row) => row.warehouse?.name || '-' },
    { key: 'prevQty', label: 'Previous Qty' },
    { key: 'newQty', label: 'New Qty' },
    { key: 'createdAt', label: 'Created', render: (value) => new Date(value).toLocaleDateString() },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading adjustments...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Adjustments</h1>
          <button
            onClick={() => router.push('/adjustments/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            New Adjustment
          </button>
        </div>
        <DataTable columns={columns} data={adjustments} />
      </div>
    </Layout>
  )
}

