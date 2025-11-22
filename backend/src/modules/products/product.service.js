import prisma from '../../core/db/prisma.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export const getAllProducts = async (filters = {}) => {
  const { search, category } = filters;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) {
    where.category = category;
  }

  return prisma.product.findMany({
    where,
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

export const createProduct = async (data) => {
  // Check if SKU exists
  const existing = await prisma.product.findUnique({
    where: { sku: data.sku },
  });

  if (existing) {
    throw new Error('Product with this SKU already exists');
  }

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

