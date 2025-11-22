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
  // Use the useTransfers hook with proper refetch function
  const { 
    data: transfers = [], 
    isLoading: loading, 
    refetch: refetchTransfers 
  } = useTransfers()
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    fromWarehouseId: '',
    toWarehouseId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleModalClose = () => {
    setFormData({ fromWarehouseId: '', toWarehouseId: '' });
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    
    setFormData(prev => {
      const newState = {
        ...prev,
        [name]: value
      };
      console.log('New form state:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fromWarehouseId || !formData.toWarehouseId) {
      alert('Please select both source and destination warehouses');
      return;
    }
    
    if (formData.fromWarehouseId === formData.toWarehouseId) {
      alert('Source and destination warehouses must be different');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/v1/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fromWarehouseId: formData.fromWarehouseId,
          toWarehouseId: formData.toWarehouseId,
          // Add other necessary fields
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transfer');
      }

      // Refresh the transfers list
      await refetchTransfers();
      handleModalClose();
    } catch (error) {
      console.error('Error creating transfer:', error);
      alert(error.message || 'Failed to create transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <WarehouseSelect
              name="fromWarehouseId"
              warehouses={warehouses}
              label="From Warehouse"
              onChange={handleInputChange}
              value={formData.fromWarehouseId}
              required
            />
          </div>
          <div className="mb-6">
            <WarehouseSelect
              name="toWarehouseId"
              warehouses={warehouses}
              label="To Warehouse"
              onChange={handleInputChange}
              value={formData.toWarehouseId}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Transfer'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

