'use client'

import Layout from '@/components/Layout'
import DataTable from '@/components/DataTable'
import { useAdjustments } from '@/hooks/useInventory'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import { warehousesAPI, adjustmentsAPI } from '@/services/api';
import WarehouseSelect from '@/components/WarehouseSelect';

export default function AdjustmentsPage() {
  const router = useRouter()
  const { 
    data: adjustments = [], 
    isLoading: loading, 
    refetch: refetchAdjustments 
  } = useAdjustments()
  const [isModalOpen, setModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    product: '',
    warehouseId: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        console.log('Fetching warehouses...');
        // Use the standard warehouses endpoint with authentication
        const response = await warehousesAPI.getAll();
        console.log('Warehouses API response:', response);
        
        let warehousesData = [];
        
        // Handle different possible response structures
        if (Array.isArray(response?.data)) {
          warehousesData = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          warehousesData = response.data.data;
        } else if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
          warehousesData = response.data.data.data;
        } else if (response?.data?.items && Array.isArray(response.data.items)) {
          warehousesData = response.data.items;
        }
        
        console.log('Processed warehouses data:', warehousesData);
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        console.error('Error details:', error.response?.data || error.message);
        setWarehouses([]);
      }
    };

    fetchWarehouses();
  }, []);

  const handleModalClose = () => {
    setFormData({
      product: '',
      warehouseId: '',
      quantity: ''
    });
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.product || !formData.warehouseId || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newQty = Number(formData.quantity);
      if (isNaN(newQty)) {
        throw new Error('Quantity must be a valid number');
      }

      // Use the adjustmentsAPI service for consistency
      const response = await adjustmentsAPI.create({
        productId: formData.product, // Make sure this is the product ID
        warehouseId: formData.warehouseId,
        newQty: newQty, // Changed from quantity to newQty to match backend
        reason: 'Manual adjustment', // Add a default reason
        notes: 'Adjustment made via web interface' // Add some notes
      });

      // Check if the response indicates success
      if (!response.data) {
        throw new Error('Failed to create adjustment: No data returned from server');
      }

      // Refresh the adjustments list
      await refetchAdjustments();
      
      // Reset form and close modal
      setFormData({
        product: '',
        warehouseId: '',
        quantity: ''
      });
      handleModalClose();
      
      // Show success message
      alert('Adjustment created successfully!');
    } catch (error) {
      console.error('Error creating adjustment:', error);
      let errorMessage = 'Failed to create adjustment';
      
      // Try to get more specific error message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="1"
              step="1"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Warehouse</label>
              <span className="text-xs text-gray-500">{warehouses.length} warehouses found</span>
            </div>
            <WarehouseSelect
              name="warehouseId"
              warehouses={warehouses}
              value={formData.warehouseId}
              onChange={handleInputChange}
              required
            />
            {warehouses.length === 0 && (
              <p className="mt-1 text-xs text-yellow-600">No warehouses available. Please check your connection or add warehouses first.</p>
            )}
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
              {isSubmitting ? 'Creating...' : 'Create Adjustment'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

