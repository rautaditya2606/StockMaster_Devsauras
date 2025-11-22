import prisma from '../db/prisma.js';
import { LedgerType } from '@prisma/client';

/**
 * Create stock ledger entry (supports transaction context)
 */
export const createLedgerEntry = async (data, tx = prisma) => {
  return tx.stockLedger.create({
    data: {
      productId: data.productId,
      sourceWarehouse: data.sourceWarehouse || null,
      destWarehouse: data.destWarehouse || null,
      quantity: data.quantity,
      type: data.type,
      referenceId: data.referenceId || null,
    },
  });
};

/**
 * Get or create stock level (supports transaction context)
 */
export const getOrCreateStockLevel = async (productId, warehouseId, tx = prisma) => {
  let stockLevel = await tx.stockLevel.findUnique({
    where: {
      productId_warehouseId: {
        productId,
        warehouseId,
      },
    },
  });

  if (!stockLevel) {
    stockLevel = await tx.stockLevel.create({
      data: {
        productId,
        warehouseId,
        quantity: 0,
      },
    });
  }

  return stockLevel;
};

/**
 * Update stock level atomically (supports transaction context)
 */
export const updateStockLevel = async (productId, warehouseId, quantityChange, tx = prisma) => {
  const stockLevel = await getOrCreateStockLevel(productId, warehouseId, tx);
  
  return tx.stockLevel.update({
    where: {
      id: stockLevel.id,
    },
    data: {
      quantity: {
        increment: quantityChange,
      },
    },
  });
};

/**
 * Validate stock availability (supports transaction context)
 */
export const validateStockAvailability = async (productId, warehouseId, requiredQuantity, tx = prisma) => {
  const stockLevel = await getOrCreateStockLevel(productId, warehouseId, tx);
  
  if (stockLevel.quantity < requiredQuantity) {
    throw new Error(`Insufficient stock. Available: ${stockLevel.quantity}, Required: ${requiredQuantity}`);
  }
  
  return stockLevel;
};

