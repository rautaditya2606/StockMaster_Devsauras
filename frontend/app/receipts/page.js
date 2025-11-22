'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { useReceipts } from '@/hooks/useInventory';

export default function ReceiptsPage() {
  const router = useRouter();
  const { 
    data: receipts = [], 
    isLoading, 
    isFetching, 
    refetch 
  } = useReceipts();

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
    { key: 'supplierName', label: 'Supplier' },
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

  const handleNewReceipt = () => {
    router.push('/receipts/new');
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
            {isFetching && !isLoading && (
              <p className="text-xs text-gray-500 mt-1">Updating...</p>
            )}
          </div>
          <button
            onClick={handleNewReceipt}
            disabled={isLoading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            New Receipt
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading receipts...</p>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={receipts} 
            onRowClick={(row) => router.push(`/receipts/${row.id}`)}
          />
        )}
      </div>
    </Layout>
  );
}

