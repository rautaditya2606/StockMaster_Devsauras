'use client'

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useProducts } from '@/hooks/useProducts';
import { useWarehouses } from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import { FaPlus, FaSearch, FaBox, FaLaptop, FaGamepad, FaBook } from 'react-icons/fa';

export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  const { data: products = [], isLoading: loading } = useProducts();
  const { data: warehouses = [] } = useWarehouses();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isManager = user?.role === 'MANAGER';

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'mobile':
        return <FaBox className="w-5 h-5 text-blue-500" />;
      case 'laptop':
        return <FaLaptop className="w-5 h-5 text-green-500" />;
      case 'gaming console':
        return <FaGamepad className="w-5 h-5 text-purple-500" />;
      case 'study related electronics':
        return <FaBook className="w-5 h-5 text-yellow-500" />;
      default:
        return <FaBox className="w-5 h-5 text-gray-500" />;
    }
  };

  // Filter products based on warehouse selection
  const filteredProducts = products.filter(product => {
    if (!isManager || selectedWarehouse === 'all') return true;
    return product.stockLevels?.some(sl => sl.warehouseId === selectedWarehouse);
  });

  // Group products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(productsByCategory).sort();

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Browse and manage your inventory</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {isManager && (
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="block w-full sm:w-64 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
            )}
            {!isManager && (
              <button
                onClick={() => router.push('/products/new')}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FaPlus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaBox className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedWarehouse !== 'all' ? 'No products in the selected warehouse.' : 'Get started by adding a new product.'}
            </p>
            {!isManager && (
              <div className="mt-6">
                <button
                  onClick={() => router.push('/products/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  New Product
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    {getCategoryIcon(category)}
                    <h3 className="text-lg leading-6 font-medium text-gray-900 ml-2">
                      {category}
                    </h3>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {productsByCategory[category].length} items
                    </span>
                  </div>
                </div>
                <div className="bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                    {productsByCategory[category].map((product) => (
                      <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.sku}</p>
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {product.uom}
                            </div>
                          </div>
                          
                          {isManager && product.stockLevels?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <h5 className="text-xs font-medium text-gray-500 mb-1">Stock Levels</h5>
                              <div className="space-y-1">
                                {product.stockLevels.map((sl) => (
                                  <div key={sl.warehouseId} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{sl.warehouse?.name || 'Unknown'}</span>
                                    <span className="font-medium">{sl.quantity} {product.uom}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

