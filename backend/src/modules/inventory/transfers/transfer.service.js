import prisma from '../../../core/db/prisma.js';
import { NotFoundError, ValidationError } from '../../../core/errors/AppError.js';
import { validateTransition } from '../../../core/utils/stateMachine.js';
import {
  updateStockLevel,
  createLedgerEntry,
  validateStockAvailability,
} from '../../../core/utils/stockOperations.js';
import { LedgerType } from '@prisma/client';

export const getAllTransfers = async (filters = {}) => {
  const { status, fromWarehouseId, toWarehouseId } = filters;

  const where = {};
  if (status) where.status = status;
  if (fromWarehouseId) where.fromWarehouseId = fromWarehouseId;
  if (toWarehouseId) where.toWarehouseId = toWarehouseId;

  return prisma.transfer.findMany({
    where,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      fromWarehouse: {
        select: {
          id: true,
          name: true,
        },
      },
      toWarehouse: {
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

export const getTransferById = async (id) => {
  const transfer = await prisma.transfer.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      fromWarehouse: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
      toWarehouse: {
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

  if (!transfer) {
    throw new NotFoundError('Transfer');
  }

  return transfer;
};

export const createTransfer = async (data, userId) => {
  if (data.fromWarehouseId === data.toWarehouseId) {
    throw new ValidationError('Source and destination warehouses must be different');
  }

  return prisma.transfer.create({
    data: {
      fromWarehouseId: data.fromWarehouseId,
      toWarehouseId: data.toWarehouseId,
      createdBy: userId,
      status: 'DRAFT',
    },
  });
};

export const addTransferItem = async (transferId, itemData) => {
  const transfer = await getTransferById(transferId);

  if (transfer.status !== 'DRAFT') {
    throw new ValidationError('Can only add items to DRAFT transfers');
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: itemData.productId },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  return prisma.transferItem.create({
    data: {
      transferId,
      productId: itemData.productId,
      quantity: itemData.quantity,
    },
  });
};

export const updateTransferStatus = async (transferId, newStatus) => {
  const transfer = await getTransferById(transferId);

  validateTransition(transfer.status, newStatus);

  return prisma.transfer.update({
    where: { id: transferId },
    data: { status: newStatus },
  });
};

export const validateTransfer = async (transferId) => {
  const transfer = await getTransferById(transferId);

  if (transfer.status !== 'READY') {
    throw new ValidationError('Transfer must be in READY status to validate');
  }

  if (!transfer.items || transfer.items.length === 0) {
    throw new ValidationError('Transfer must have at least one item');
  }

  // Transactional stock update
  return prisma.$transaction(async (tx) => {
    // Validate stock availability in source warehouse first
    for (const item of transfer.items) {
      await validateStockAvailability(
        item.productId,
        transfer.fromWarehouseId,
        item.quantity,
        tx
      );
    }

    // Update transfer status to DONE
    const updatedTransfer = await tx.transfer.update({
      where: { id: transferId },
      data: { status: 'DONE' },
    });

    // Update stock levels and create ledger entries
    for (const item of transfer.items) {
      // Decrease from source warehouse
      await updateStockLevel(
        item.productId,
        transfer.fromWarehouseId,
        -item.quantity,
        tx
      );

      // Increase in destination warehouse
      await updateStockLevel(
        item.productId,
        transfer.toWarehouseId,
        item.quantity,
        tx
      );

      // Create ledger entries
      await createLedgerEntry({
        productId: item.productId,
        sourceWarehouse: transfer.fromWarehouseId,
        quantity: item.quantity,
        type: LedgerType.TRANSFER_OUT,
        referenceId: transferId,
      }, tx);

      await createLedgerEntry({
        productId: item.productId,
        destWarehouse: transfer.toWarehouseId,
        quantity: item.quantity,
        type: LedgerType.TRANSFER_IN,
        referenceId: transferId,
      }, tx);
    }

    return updatedTransfer;
  });
};

export const deleteTransferItem = async (transferId, itemId) => {
  const transfer = await getTransferById(transferId);

  if (transfer.status !== 'DRAFT') {
    throw new ValidationError('Can only delete items from DRAFT transfers');
  }

  return prisma.transferItem.delete({
    where: { id: itemId },
  });
};

