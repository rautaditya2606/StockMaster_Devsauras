import { useQuery } from 'react-query';
import { warehousesAPI } from '@/services/api';

export const useWarehouses = () => {
  return useQuery(
    'warehouses',
    () => warehousesAPI.getAll().then(res => res.data.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

export const useWarehouse = (id) => {
  return useQuery(
    ['warehouses', id],
    () => warehousesAPI.getById(id).then(res => res.data.data),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  );
};
