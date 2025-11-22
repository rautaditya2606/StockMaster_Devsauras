import prisma from '../../core/db/prisma.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export const getAllWarehouses = async () => {
  return prisma.warehouse.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getWarehouseById = async (id) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { id },
  });

  if (!warehouse) {
    throw new NotFoundError('Warehouse');
  }

  return warehouse;
};

export const createWarehouse = async (data) => {
  return prisma.warehouse.create({
    data,
  });
};

export const updateWarehouse = async (id, data) => {
  await getWarehouseById(id);
  return prisma.warehouse.update({
    where: { id },
    data,
  });
};

export const deleteWarehouse = async (id) => {
  await getWarehouseById(id);
  return prisma.warehouse.delete({
    where: { id },
  });
};

export const getWarehouseStock = async (warehouseId) => {
  await getWarehouseById(warehouseId);

  return prisma.stockLevel.findMany({
    where: { warehouseId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          category: true,
          uom: true,
        },
      },
    },
  });
};

