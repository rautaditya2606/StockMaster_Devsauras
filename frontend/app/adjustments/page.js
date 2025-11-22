'use client'

import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import { useAdjustments } from '@/hooks/useInventory'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdjustmentsPage() {
  const router = useRouter()
  const { data: adjustments = [], isLoading: loading } = useAdjustments()
  const [isModalOpen, setModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get('/api/v1/warehouses/public');
        setWarehouses(response.data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();
  }, []);

  const handleModalClose = () => setModalOpen(false);

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
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            New Adjustment
          </button>
        </div>
        <DataTable columns={columns} data={adjustments} />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Create New Adjustment">
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <input
              type="text"
              className="block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select
              className="block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Submit
          </button>
        </form>
      </Modal>
    </Layout>
  );
}

