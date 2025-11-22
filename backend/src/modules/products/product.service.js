import prisma from '../../core/db/prisma.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export const getAllProducts = async (user, filters = {}) => {
  const { warehouseId, role } = user;
  const { search, category, warehouseId: filterWarehouseId } = filters;

  const where = {};

  // If warehouse staff, only show products in their warehouse
  if (role === 'WAREHOUSE_STAFF' && warehouseId) {
    where.stockLevels = {
      some: { warehouseId },
    };
  }
  
  // If manager and warehouse filter is provided
  if (role === 'MANAGER' && filterWarehouseId && filterWarehouseId !== 'all') {
    where.stockLevels = {
      some: { warehouseId: filterWarehouseId },
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const include = {};
  // If manager, include stock levels to show warehouse info
  if (user.role === 'MANAGER') {
    include.stockLevels = {
      include: {
        warehouse: {
          select: { name: true },
        },
      },
    };
  }

  return prisma.product.findMany({
    where,
    include,
    orderBy: { createdAt: 'desc' },
  });
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  return product;
};

export const createProduct = async (data, user) => {
  // Check if SKU exists
  const existing = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existing) {
    throw new Error('Product with this SKU already exists');
  }

  // If user is staff and has a warehouseId, include stock level creation
  if (user?.role === 'WAREHOUSE_STAFF' && user?.warehouseId) {
    return prisma.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name: data.name,
          sku: data.sku,
          category: data.category,
          uom: data.uom,
          stockLevels: {
            create: {
              warehouseId: user.warehouseId,
              quantity: 0, // Default to 0 quantity
            },
          },
        },
        include: {
          stockLevels: true,
        },
      });
      return product;
    });
  }

  // For other cases (e.g., manager or no warehouse assigned)
  return prisma.product.create({
    data,
  });
};

export const updateProduct = async (id, data) => {
  await getProductById(id); // Validate exists

  if (data.sku) {
    const existing = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existing && existing.id !== id) {
      throw new Error('Product with this SKU already exists');
    }
  }

  return prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id) => {
  await getProductById(id);
  return prisma.product.delete({
    where: { id },
  });
};

export const getProductStockLevels = async (productId) => {
  await getProductById(productId);

  return prisma.stockLevel.findMany({
    where: { productId },
    include: {
      warehouse: {
        select: {
          id: true,
          name: true,
          location: true,
        },
      },
    },
  });
};

