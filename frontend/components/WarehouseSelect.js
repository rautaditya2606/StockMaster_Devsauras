import React from 'react';
import PropTypes from 'prop-types';

const WarehouseSelect = ({ 
  warehouses = [], 
  label = 'Warehouse', 
  onChange = () => {}, 
  value = '' 
}) => {
  // Ensure warehouses is always an array
  const warehouseList = Array.isArray(warehouses) ? warehouses : [];
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className="block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        onChange={onChange}
        value={value}
      >
        <option value="">
          {warehouseList.length === 0 ? 'No Warehouses Available' : 'Select Warehouse'}
        </option>
        {warehouseList.map((warehouse) => (
          <option key={warehouse?.id || ''} value={warehouse?.id || ''}>
            {warehouse?.name || 'Unnamed Warehouse'}
          </option>
        ))}
      </select>
    </div>
  );
};

WarehouseSelect.propTypes = {
  warehouses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
    })
  ),
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default WarehouseSelect;