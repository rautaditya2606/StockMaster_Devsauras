'use client'

import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import StatusBadge from '@/components/StatusBadge'
import { useTransfers } from '@/hooks/useInventory'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import { warehousesAPI } from '@/services/api';
import WarehouseSelect from '@/components/WarehouseSelect';

export default function TransfersPage() {
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: transfers = [], isLoading: loading } = useTransfers()
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await warehousesAPI.getAll();
        console.log('Warehouses response:', response);
        // Ensure we're working with an array
        const warehousesData = Array.isArray(response?.data) 
          ? response.data 
          : response?.data?.data || [];
        console.log('Processed warehouses:', warehousesData);
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        setWarehouses([]); // Ensure we always have an array
      }
    };

    fetchWarehouses();
  }, []);

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

  const handleModalClose = () => setModalOpen(false);

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
            onClick={() => setModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            New Transfer
          </button>
        </div>
        <DataTable columns={columns} data={transfers} />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Create New Transfer">
        <form>
          <WarehouseSelect
            warehouses={warehouses}
            label="From Warehouse"
            onChange={(e) => console.log('From Warehouse Selected:', e.target.value)}
            value=""
          />
          <WarehouseSelect
            warehouses={warehouses}
            label="To Warehouse"
            onChange={(e) => console.log('To Warehouse Selected:', e.target.value)}
            value=""
          />
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

