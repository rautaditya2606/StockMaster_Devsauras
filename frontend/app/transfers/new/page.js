import React from 'react';
import Layout from '@/components/Layout';

export default function NewTransfer() {
  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Transfer</h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">From Warehouse</label>
            <input
              type="text"
              className="block w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">To Warehouse</label>
            <input
              type="text"
              className="block w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}