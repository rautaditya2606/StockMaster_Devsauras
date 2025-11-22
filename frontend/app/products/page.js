'use client'

import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import { useProducts } from '@/hooks/useProducts'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()
  const { data: products = [], isLoading: loading } = useProducts()

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'category', label: 'Category' },
    { key: 'uom', label: 'UOM' },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => router.push('/products/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Product
          </button>
        </div>
        <DataTable columns={columns} data={products} />
      </div>
    </Layout>
  )
}

