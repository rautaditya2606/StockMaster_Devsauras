import prisma from '../../core/db/prisma.js';

export const getDashboardKPIs = async () => {
  const [
    totalProducts,
    totalWarehouses,
    lowStockItems,
    pendingReceipts,
    pendingDeliveries,
    pendingTransfers,
    stockByWarehouse,
    categoryBreakdown,
  ] = await Promise.all([
    // Total products
    prisma.product.count(),

    // Total warehouses
    prisma.warehouse.count(),

    // Low stock items (quantity < 10)
    prisma.stockLevel.findMany({
      where: {
        quantity: {
          lt: 10,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            uom: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    // Pending documents
    prisma.receipt.count({
      where: {
        status: {
          in: ['DRAFT', 'WAITING', 'READY'],
        },
      },
    }),

    prisma.delivery.count({
      where: {
        status: {
          in: ['DRAFT', 'WAITING', 'READY'],
        },
      },
    }),

    prisma.transfer.count({
      where: {
        status: {
          in: ['DRAFT', 'WAITING', 'READY'],
        },
      },
    }),

    // Stock by warehouse
    prisma.stockLevel.groupBy({
      by: ['warehouseId'],
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
    }),

    // Category breakdown
    prisma.product.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
    }),
  ]);

  // Enrich stock by warehouse with warehouse details
  const stockByWarehouseEnriched = await Promise.all(
    stockByWarehouse.map(async (item) => {
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: item.warehouseId },
        select: {
          id: true,
          name: true,
          location: true,
        },
      });

      return {
        warehouse,
        totalQuantity: item._sum.quantity || 0,
        productCount: item._count.productId,
      };
    })
  );

  return {
    totalProducts,
    totalWarehouses,
    lowStockItems,
    pendingDocuments: {
      receipts: pendingReceipts,
      deliveries: pendingDeliveries,
      transfers: pendingTransfers,
      total: pendingReceipts + pendingDeliveries + pendingTransfers,
    },
    stockByWarehouse: stockByWarehouseEnriched,
    categoryBreakdown: categoryBreakdown.map((item) => ({
      category: item.category,
      count: item._count.id,
    })),
  };
};

/**
 * Get stock distribution by category for a warehouse
 */
export const getStockByCategory = async (warehouseId = null) => {
  const where = {};
  if (warehouseId) {
    where.warehouseId = warehouseId;
  }

  const stockLevels = await prisma.stockLevel.findMany({
    where,
    include: {
      product: {
        select: {
          category: true,
        },
      },
    },
  });

  // Group by category and sum quantities
  const categoryMap = {};
  stockLevels.forEach((stock) => {
    const category = stock.product.category;
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    categoryMap[category] += stock.quantity;
  });

  return Object.entries(categoryMap).map(([category, quantity]) => ({
    category,
    quantity,
  }));
};

/**
 * Get stock history over time for a warehouse
 */
export const getStockHistory = async (warehouseId = null, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const where = {
    timestamp: {
      gte: startDate,
    },
  };

  if (warehouseId) {
    where.OR = [
      { sourceWarehouse: warehouseId },
      { destWarehouse: warehouseId },
    ];
  }

  const ledgerEntries = await prisma.stockLedger.findMany({
    where,
    include: {
      product: {
        select: {
          name: true,
          category: true,
        },
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  // Group by date and calculate net stock change
  const dateMap = {};
  ledgerEntries.forEach((entry) => {
    const date = entry.timestamp.toISOString().split('T')[0];
    if (!dateMap[date]) {
      dateMap[date] = {
        date,
        totalIn: 0,
        totalOut: 0,
        netChange: 0,
      };
    }

    if (entry.type === 'RECEIPT' || entry.type === 'TRANSFER_IN' || entry.type === 'ADJUSTMENT') {
      dateMap[date].totalIn += entry.quantity;
      dateMap[date].netChange += entry.quantity;
    } else if (entry.type === 'DELIVERY' || entry.type === 'TRANSFER_OUT') {
      dateMap[date].totalOut += entry.quantity;
      dateMap[date].netChange -= entry.quantity;
    }
  });

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get stock distribution across warehouses (pie chart data)
 */
export const getWarehouseStockDistribution = async () => {
  const warehouses = await prisma.warehouse.findMany({
    include: {
      stockLevels: true,
    },
  });

  return warehouses.map((warehouse) => {
    const totalStock = warehouse.stockLevels.reduce(
      (sum, stock) => sum + stock.quantity,
      0
    );
    return {
      name: warehouse.name,
      value: totalStock,
      location: warehouse.location,
    };
  });
};

/**
 * Get top products by stock quantity for a warehouse
 */
export const getTopProducts = async (warehouseId = null, limit = 10) => {
  const where = {};
  if (warehouseId) {
    where.warehouseId = warehouseId;
  }

  const stockLevels = await prisma.stockLevel.findMany({
    where,
    include: {
      product: {
        select: {
          name: true,
          sku: true,
          category: true,
        },
      },
      warehouse: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      quantity: 'desc',
    },
    take: limit,
  });

  return stockLevels.map((stock) => ({
    productName: stock.product.name,
    sku: stock.product.sku,
    category: stock.product.category,
    quantity: stock.quantity,
    warehouseName: stock.warehouse.name,
  }));
};
