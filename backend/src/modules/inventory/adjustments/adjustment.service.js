import prisma from '../../../core/db/prisma.js';
import { NotFoundError } from '../../../core/errors/AppError.js';
import {
  getOrCreateStockLevel,
  updateStockLevel,
  createLedgerEntry,
} from '../../../core/utils/stockOperations.js';
import { LedgerType } from '@prisma/client';

export const getAllAdjustments = async (filters = {}) => {
  const { warehouseId, productId } = filters;

  const where = {};
  if (warehouseId) where.warehouseId = warehouseId;
  if (productId) where.productId = productId;

  return prisma.adjustment.findMany({
    where,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      warehouse: {
        select: {
          id: true,
          name: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          uom: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAdjustmentById = async (id) => {
  const adjustment = await prisma.adjustment.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      warehouse: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
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

  if (!adjustment) {
    throw new NotFoundError('Adjustment');
  }

  return adjustment;
};

export const createAdjustment = async (data, userId) => {
  // Verify product and warehouse exist
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: data.warehouseId },
  });

  if (!warehouse) {
    throw new NotFoundError('Warehouse');
  }

  const newQty = data.newQty;

  // Transactional adjustment
  return prisma.$transaction(async (tx) => {
    // Get current stock level within transaction
    const stockLevel = await getOrCreateStockLevel(data.productId, data.warehouseId, tx);
    const prevQty = stockLevel.quantity;
    const difference = newQty - prevQty;

    // Update stock level
    await tx.stockLevel.update({
      where: {
        id: stockLevel.id,
      },
      data: {
        quantity: newQty,
      },
    });

    // Create adjustment record
    const adjustment = await tx.adjustment.create({
      data: {
        warehouseId: data.warehouseId,
        productId: data.productId,
        prevQty,
        newQty,
        reason: data.reason || null,
        createdBy: userId,
      },
    });

    // Create ledger entry
    await createLedgerEntry({
      productId: data.productId,
      destWarehouse: data.warehouseId,
      quantity: Math.abs(difference),
      type: LedgerType.ADJUSTMENT,
      referenceId: adjustment.id,
    }, tx);

    return adjustment;
  });
};

