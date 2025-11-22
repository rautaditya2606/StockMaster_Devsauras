'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { transfersAPI } from '@/services/api'
import { useRouter } from 'next/navigation'

export default function TransfersPage() {
  const router = useRouter()
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      const response = await transfersAPI.getAll()
      setTransfers(response.data.data)
    } catch (error) {
      console.error('Failed to fetch transfers:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'fromWarehouse',
      label: 'From',
      render: (value, row) => row.fromWarehouse?.name || '-',
    },
    {
      key: 'toWarehouse',
      label: 'To',
      render: (value, row) => row.toWarehouse?.name || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    { key: 'createdAt', label: 'Created', render: (value) => new Date(value).toLocaleDateString() },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading transfers...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
          <button
            onClick={() => router.push('/transfers/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            New Transfer
          </button>
        </div>
        <DataTable columns={columns} data={transfers} />
      </div>
    </Layout>
  )
}

