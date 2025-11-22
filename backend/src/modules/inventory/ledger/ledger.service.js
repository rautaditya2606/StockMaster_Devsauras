import prisma from '../../../core/db/prisma.js';

export const getLedgerEntries = async (filters = {}) => {
  const { productId, warehouseId, type, startDate, endDate, limit = 100 } = filters;

  const where = {};

  if (productId) {
    where.productId = productId;
  }

  if (warehouseId) {
    where.OR = [
      { sourceWarehouse: warehouseId },
      { destWarehouse: warehouseId },
    ];
  }

  if (type) {
    where.type = type;
  }

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = new Date(startDate);
    if (endDate) where.timestamp.lte = new Date(endDate);
  }

  return prisma.stockLedger.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          uom: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
    take: parseInt(limit),
  });
};

export const getProductLedger = async (productId, filters = {}) => {
  return getLedgerEntries({
    ...filters,
    productId,
  });
};

export const getWarehouseLedger = async (warehouseId, filters = {}) => {
  return getLedgerEntries({
    ...filters,
    warehouseId,
  });
};

