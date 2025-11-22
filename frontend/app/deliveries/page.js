'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { useDeliveries } from '@/hooks/useInventory';
import Modal from '@/components/Modal';
import { useState } from 'react';

export default function DeliveriesPage() {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const { 
    data: deliveries = [], 
    isLoading, 
    isFetching, 
    refetch 
  } = useDeliveries();

  // Refresh data when the page is focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  const columns = [
    { key: 'customerName', label: 'Customer' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    { key: 'warehouse', label: 'Warehouse', render: (value, row) => row.warehouse?.name || '-' },
    { 
      key: 'createdAt', 
      label: 'Created', 
      render: (value) => new Date(value).toLocaleString() 
    },
  ];

  const handleModalClose = () => {
    console.log('Closing modal');
    setModalOpen(false);
  };

  const handleNewDeliveryClick = (e) => {
    e.preventDefault();
    console.log('New Delivery button clicked');
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
            {isFetching && !isLoading && (
              <p className="text-xs text-gray-500 mt-1">Updating...</p>
            )}
          </div>
          <button
            onClick={handleNewDeliveryClick}
            disabled={isLoading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            id="new-delivery-button"
          >
            {isLoading ? 'Loading...' : 'New Delivery'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading deliveries...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={deliveries} />
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title="Create New Delivery"
        className="z-50"
      >
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              className="block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <input
              type="text"
              className="block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
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

