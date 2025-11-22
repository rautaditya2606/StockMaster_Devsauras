import prisma from '../../../core/db/prisma.js';
import { NotFoundError, ValidationError } from '../../../core/errors/AppError.js';
import { validateTransition } from '../../../core/utils/stateMachine.js';
import {
  updateStockLevel,
  createLedgerEntry,
  validateStockAvailability,
} from '../../../core/utils/stockOperations.js';
import { LedgerType } from '@prisma/client';

export const getAllDeliveries = async (filters = {}) => {
  const { status, warehouseId } = filters;

  const where = {};
  if (status) where.status = status;
  if (warehouseId) where.warehouseId = warehouseId;

  return prisma.delivery.findMany({
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

export const getDeliveryById = async (id) => {
  const delivery = await prisma.delivery.findUnique({
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

  if (!delivery) {
    throw new NotFoundError('Delivery');
  }

  return delivery;
};

export const createDelivery = async (data, userId) => {
  return prisma.delivery.create({
    data: {
      customerName: data.customerName,
      warehouseId: data.warehouseId,
      createdBy: userId,
      status: 'DRAFT',
    },
  });
};

export const addDeliveryItem = async (deliveryId, itemData) => {
  const delivery = await getDeliveryById(deliveryId);

  if (delivery.status !== 'DRAFT') {
    throw new ValidationError('Can only add items to DRAFT deliveries');
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: itemData.productId },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  return prisma.deliveryItem.create({
    data: {
      deliveryId,
      productId: itemData.productId,
      quantity: itemData.quantity,
    },
  });
};

export const updateDeliveryStatus = async (deliveryId, newStatus) => {
  const delivery = await getDeliveryById(deliveryId);

  validateTransition(delivery.status, newStatus);

  return prisma.delivery.update({
    where: { id: deliveryId },
    data: { status: newStatus },
  });
};

export const validateDelivery = async (deliveryId) => {
  const delivery = await getDeliveryById(deliveryId);

  if (delivery.status !== 'READY') {
    throw new ValidationError('Delivery must be in READY status to validate');
  }

  if (!delivery.items || delivery.items.length === 0) {
    throw new ValidationError('Delivery must have at least one item');
  }

  // Transactional stock update
  return prisma.$transaction(async (tx) => {
    // Validate stock availability first
    for (const item of delivery.items) {
      await validateStockAvailability(
        item.productId,
        delivery.warehouseId,
        item.quantity,
        tx
      );
    }

    // Update delivery status to DONE
    const updatedDelivery = await tx.delivery.update({
      where: { id: deliveryId },
      data: { status: 'DONE' },
    });

    // Update stock levels and create ledger entries
    for (const item of delivery.items) {
      // Decrease stock
      await updateStockLevel(
        item.productId,
        delivery.warehouseId,
        -item.quantity,
        tx
      );

      // Create ledger entry
      await createLedgerEntry({
        productId: item.productId,
        sourceWarehouse: delivery.warehouseId,
        quantity: item.quantity,
        type: LedgerType.DELIVERY,
        referenceId: deliveryId,
      }, tx);
    }

    return updatedDelivery;
  });
};

export const deleteDeliveryItem = async (deliveryId, itemId) => {
  const delivery = await getDeliveryById(deliveryId);

  if (delivery.status !== 'DRAFT') {
    throw new ValidationError('Can only delete items from DRAFT deliveries');
  }

  return prisma.deliveryItem.delete({
    where: { id: itemId },
  });
};

