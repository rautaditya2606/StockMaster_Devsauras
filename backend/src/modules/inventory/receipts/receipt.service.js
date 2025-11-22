import prisma from '../../../core/db/prisma.js';
import { NotFoundError, ValidationError } from '../../../core/errors/AppError.js';
import { validateTransition } from '../../../core/utils/stateMachine.js';
import {
  updateStockLevel,
  createLedgerEntry,
} from '../../../core/utils/stockOperations.js';
import { LedgerType } from '@prisma/client';

export const getAllReceipts = async (filters = {}) => {
  const { status, warehouseId } = filters;

  const where = {};
  if (status) where.status = status;
  if (warehouseId) where.warehouseId = warehouseId;

  return prisma.receipt.findMany({
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
      items: {
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
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReceiptById = async (id) => {
  const receipt = await prisma.receipt.findUnique({
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
      items: {
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
      },
    },
  });

  if (!receipt) {
    throw new NotFoundError('Receipt');
  }

  return receipt;
};

export const createReceipt = async (data, userId) => {
  return prisma.receipt.create({
    data: {
      supplierName: data.supplierName,
      warehouseId: data.warehouseId,
      createdBy: userId,
      status: 'DRAFT',
    },
  });
};

export const addReceiptItem = async (receiptId, itemData) => {
  const receipt = await getReceiptById(receiptId);

  if (receipt.status !== 'DRAFT') {
    throw new ValidationError('Can only add items to DRAFT receipts');
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: itemData.productId },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  return prisma.receiptItem.create({
    data: {
      receiptId,
      productId: itemData.productId,
      quantity: itemData.quantity,
    },
  });
};

export const updateReceiptStatus = async (receiptId, newStatus) => {
  const receipt = await getReceiptById(receiptId);

  validateTransition(receipt.status, newStatus);

  return prisma.receipt.update({
    where: { id: receiptId },
    data: { status: newStatus },
  });
};

export const validateReceipt = async (receiptId) => {
  const receipt = await getReceiptById(receiptId);

  if (receipt.status !== 'READY') {
    throw new ValidationError('Receipt must be in READY status to validate');
  }

  if (!receipt.items || receipt.items.length === 0) {
    throw new ValidationError('Receipt must have at least one item');
  }

  // Transactional stock update
  return prisma.$transaction(async (tx) => {
    // Update receipt status to DONE
    const updatedReceipt = await tx.receipt.update({
      where: { id: receiptId },
      data: { status: 'DONE' },
    });

    // Update stock levels and create ledger entries
    for (const item of receipt.items) {
      // Increase stock
      await updateStockLevel(
        item.productId,
        receipt.warehouseId,
        item.quantity,
        tx
      );

      // Create ledger entry
      await createLedgerEntry({
        productId: item.productId,
        destWarehouse: receipt.warehouseId,
        quantity: item.quantity,
        type: LedgerType.RECEIPT,
        referenceId: receiptId,
      }, tx);
    }

    return updatedReceipt;
  });
};

export const deleteReceiptItem = async (receiptId, itemId) => {
  const receipt = await getReceiptById(receiptId);

  if (receipt.status !== 'DRAFT') {
    throw new ValidationError('Can only delete items from DRAFT receipts');
  }

  return prisma.receiptItem.delete({
    where: { id: itemId },
  });
};

