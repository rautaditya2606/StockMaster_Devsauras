'use client'

import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { useReceipts } from '@/hooks/useInventory'
import { useRouter } from 'next/navigation'

export default function ReceiptsPage() {
  const router = useRouter()
  const { data: receipts = [], isLoading: loading } = useReceipts()

  const columns = [
    { key: 'supplierName', label: 'Supplier' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    { key: 'warehouse', label: 'Warehouse', render: (value, row) => row.warehouse?.name || '-' },
    { key: 'createdAt', label: 'Created', render: (value) => new Date(value).toLocaleDateString() },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading receipts...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
          <button
            onClick={() => router.push('/receipts/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            New Receipt
          </button>
        </div>
        <DataTable columns={columns} data={receipts} />
      </div>
    </Layout>
  )
}

