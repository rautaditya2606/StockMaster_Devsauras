import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.stockLedger.deleteMany();
  await prisma.adjustment.deleteMany();
  await prisma.transferItem.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.deliveryItem.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.receiptItem.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.stockLevel.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();

  // Create Warehouses first (needed for user assignment)
  console.log('\n🏭 Creating warehouses...');
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      location: 'New York, NY',
    },
  });
  console.log('✅ Created:', warehouse1.name);

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'West Coast Distribution',
      location: 'Los Angeles, CA',
    },
  });
  console.log('✅ Created:', warehouse2.name);

  const warehouse3 = await prisma.warehouse.create({
    data: {
      name: 'East Coast Hub',
      location: 'Boston, MA',
    },
  });
  console.log('✅ Created:', warehouse3.name);

  // Create Users
  console.log('\n👥 Creating users...');
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@stockmaster.com',
      password: managerPassword,
      role: 'MANAGER',
      // Manager has no warehouseId (can see all)
    },
  });
  console.log('✅ Created Manager:', manager.email);

  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.create({
    data: {
      name: 'Warehouse Staff',
      email: 'staff@stockmaster.com',
      password: staffPassword,
      role: 'WAREHOUSE_STAFF',
      warehouseId: warehouse1.id, // Assign to Main Warehouse
    },
  });
  console.log('✅ Created Warehouse Staff:', staff.email, `(Assigned to: ${warehouse1.name})`);


  // Create Products
  console.log('\n📦 Creating products...');
  const products = [
    { name: 'Laptop Pro 15"', sku: 'LAP-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Wireless Mouse', sku: 'ACC-001', category: 'Accessories', uom: 'Unit' },
    { name: 'USB-C Cable', sku: 'CAB-001', category: 'Accessories', uom: 'Unit' },
    { name: 'Mechanical Keyboard', sku: 'KEY-001', category: 'Accessories', uom: 'Unit' },
    { name: '27" Monitor', sku: 'MON-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Webcam HD', sku: 'CAM-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Desk Chair Ergonomic', sku: 'FUR-001', category: 'Furniture', uom: 'Unit' },
    { name: 'Standing Desk', sku: 'FUR-002', category: 'Furniture', uom: 'Unit' },
    { name: 'Notebook A4', sku: 'OFF-001', category: 'Office Supplies', uom: 'Pack' },
    { name: 'Pen Set', sku: 'OFF-002', category: 'Office Supplies', uom: 'Set' },
    { name: 'Printer Paper', sku: 'OFF-003', category: 'Office Supplies', uom: 'Ream' },
    { name: 'Stapler', sku: 'OFF-004', category: 'Office Supplies', uom: 'Unit' },
    { name: 'Coffee Maker', sku: 'BRK-001', category: 'Break Room', uom: 'Unit' },
    { name: 'Water Bottle', sku: 'BRK-002', category: 'Break Room', uom: 'Unit' },
    { name: 'Headphones Wireless', sku: 'ACC-002', category: 'Accessories', uom: 'Unit' },
  ];

  const createdProducts = [];
  for (const product of products) {
    const p = await prisma.product.create({ data: product });
    createdProducts.push(p);
    console.log(`✅ Created: ${product.name} (${product.sku})`);
  }

  // Create Stock Levels
  console.log('\n📊 Creating stock levels...');
  const stockLevels = [
    // Main Warehouse stock
    { product: createdProducts[0], warehouse: warehouse1, quantity: 50 }, // Laptop
    { product: createdProducts[1], warehouse: warehouse1, quantity: 200 }, // Mouse
    { product: createdProducts[2], warehouse: warehouse1, quantity: 150 }, // USB-C Cable
    { product: createdProducts[3], warehouse: warehouse1, quantity: 75 }, // Keyboard
    { product: createdProducts[4], warehouse: warehouse1, quantity: 30 }, // Monitor
    { product: createdProducts[5], warehouse: warehouse1, quantity: 100 }, // Webcam
    { product: createdProducts[6], warehouse: warehouse1, quantity: 25 }, // Chair
    { product: createdProducts[7], warehouse: warehouse1, quantity: 15 }, // Desk
    { product: createdProducts[8], warehouse: warehouse1, quantity: 500 }, // Notebook
    { product: createdProducts[9], warehouse: warehouse1, quantity: 300 }, // Pen Set
    { product: createdProducts[10], warehouse: warehouse1, quantity: 200 }, // Paper
    { product: createdProducts[11], warehouse: warehouse1, quantity: 50 }, // Stapler
    { product: createdProducts[12], warehouse: warehouse1, quantity: 5 }, // Coffee Maker
    { product: createdProducts[13], warehouse: warehouse1, quantity: 8 }, // Water Bottle (LOW STOCK)
    { product: createdProducts[14], warehouse: warehouse1, quantity: 60 }, // Headphones

    // West Coast Distribution stock
    { product: createdProducts[0], warehouse: warehouse2, quantity: 30 }, // Laptop
    { product: createdProducts[1], warehouse: warehouse2, quantity: 120 }, // Mouse
    { product: createdProducts[2], warehouse: warehouse2, quantity: 100 }, // USB-C Cable
    { product: createdProducts[4], warehouse: warehouse2, quantity: 20 }, // Monitor
    { product: createdProducts[5], warehouse: warehouse2, quantity: 80 }, // Webcam
    { product: createdProducts[6], warehouse: warehouse2, quantity: 15 }, // Chair
    { product: createdProducts[8], warehouse: warehouse2, quantity: 300 }, // Notebook
    { product: createdProducts[9], warehouse: warehouse2, quantity: 200 }, // Pen Set

    // East Coast Hub stock
    { product: createdProducts[0], warehouse: warehouse3, quantity: 25 }, // Laptop
    { product: createdProducts[1], warehouse: warehouse3, quantity: 100 }, // Mouse
    { product: createdProducts[3], warehouse: warehouse3, quantity: 50 }, // Keyboard
    { product: createdProducts[4], warehouse: warehouse3, quantity: 15 }, // Monitor
    { product: createdProducts[8], warehouse: warehouse3, quantity: 250 }, // Notebook
    { product: createdProducts[10], warehouse: warehouse3, quantity: 150 }, // Paper
  ];

  for (const stock of stockLevels) {
    await prisma.stockLevel.create({
      data: {
        productId: stock.product.id,
        warehouseId: stock.warehouse.id,
        quantity: stock.quantity,
      },
    });
  }
  console.log(`✅ Created ${stockLevels.length} stock level entries`);

  // Create Sample Receipt (DONE - already processed)
  console.log('\n📥 Creating sample receipts...');
  const receipt1 = await prisma.receipt.create({
    data: {
      supplierName: 'Tech Supplies Inc.',
      warehouseId: warehouse1.id,
      createdBy: manager.id,
      status: 'DONE',
      items: {
        create: [
          { productId: createdProducts[0].id, quantity: 20 }, // Laptops
          { productId: createdProducts[1].id, quantity: 50 }, // Mice
        ],
      },
    },
  });
  console.log('✅ Created receipt:', receipt1.id);

  // Create Sample Receipt (READY - pending validation)
  const receipt2 = await prisma.receipt.create({
    data: {
      supplierName: 'Office Depot',
      warehouseId: warehouse2.id,
      createdBy: staff.id,
      status: 'READY',
      items: {
        create: [
          { productId: createdProducts[8].id, quantity: 100 }, // Notebooks
          { productId: createdProducts[9].id, quantity: 50 }, // Pen Sets
        ],
      },
    },
  });
  console.log('✅ Created receipt (READY):', receipt2.id);

  // Create Sample Delivery (DONE - already processed)
  console.log('\n📤 Creating sample deliveries...');
  const delivery1 = await prisma.delivery.create({
    data: {
      customerName: 'ABC Corporation',
      warehouseId: warehouse1.id,
      createdBy: manager.id,
      status: 'DONE',
      items: {
        create: [
          { productId: createdProducts[0].id, quantity: 10 }, // Laptops
          { productId: createdProducts[4].id, quantity: 5 }, // Monitors
        ],
      },
    },
  });
  console.log('✅ Created delivery:', delivery1.id);

  // Create Sample Delivery (DRAFT)
  const delivery2 = await prisma.delivery.create({
    data: {
      customerName: 'XYZ Company',
      warehouseId: warehouse2.id,
      createdBy: staff.id,
      status: 'DRAFT',
      items: {
        create: [
          { productId: createdProducts[1].id, quantity: 20 }, // Mice
        ],
      },
    },
  });
  console.log('✅ Created delivery (DRAFT):', delivery2.id);

  // Create Sample Transfer (DONE)
  console.log('\n🚚 Creating sample transfers...');
  const transfer1 = await prisma.transfer.create({
    data: {
      fromWarehouseId: warehouse1.id,
      toWarehouseId: warehouse2.id,
      createdBy: manager.id,
      status: 'DONE',
      items: {
        create: [
          { productId: createdProducts[0].id, quantity: 5 }, // Laptops
          { productId: createdProducts[1].id, quantity: 30 }, // Mice
        ],
      },
    },
  });
  console.log('✅ Created transfer:', transfer1.id);

  // Create Sample Transfer (WAITING)
  const transfer2 = await prisma.transfer.create({
    data: {
      fromWarehouseId: warehouse2.id,
      toWarehouseId: warehouse3.id,
      createdBy: staff.id,
      status: 'WAITING',
      items: {
        create: [
          { productId: createdProducts[8].id, quantity: 50 }, // Notebooks
        ],
      },
    },
  });
  console.log('✅ Created transfer (WAITING):', transfer2.id);

  // Create Sample Adjustments
  console.log('\n🔧 Creating sample adjustments...');
  const adjustment1 = await prisma.adjustment.create({
    data: {
      warehouseId: warehouse1.id,
      productId: createdProducts[13].id, // Water Bottle
      prevQty: 8,
      newQty: 10,
      reason: 'Found 2 additional units during inventory count',
      createdBy: manager.id,
    },
  });
  console.log('✅ Created adjustment:', adjustment1.id);

  // Update stock level for adjustment (since adjustments immediately update stock)
  await prisma.stockLevel.update({
    where: {
      productId_warehouseId: {
        productId: createdProducts[13].id,
        warehouseId: warehouse1.id,
      },
    },
    data: { quantity: 10 },
  });

  // Create Ledger Entries for demo
  console.log('\n📝 Creating ledger entries...');
  const ledgerEntries = [
    {
      productId: createdProducts[0].id,
      destWarehouse: warehouse1.id,
      quantity: 20,
      type: 'RECEIPT',
      referenceId: receipt1.id,
    },
    {
      productId: createdProducts[1].id,
      destWarehouse: warehouse1.id,
      quantity: 50,
      type: 'RECEIPT',
      referenceId: receipt1.id,
    },
    {
      productId: createdProducts[0].id,
      sourceWarehouse: warehouse1.id,
      quantity: 10,
      type: 'DELIVERY',
      referenceId: delivery1.id,
    },
    {
      productId: createdProducts[4].id,
      sourceWarehouse: warehouse1.id,
      quantity: 5,
      type: 'DELIVERY',
      referenceId: delivery1.id,
    },
    {
      productId: createdProducts[0].id,
      sourceWarehouse: warehouse1.id,
      quantity: 5,
      type: 'TRANSFER_OUT',
      referenceId: transfer1.id,
    },
    {
      productId: createdProducts[0].id,
      destWarehouse: warehouse2.id,
      quantity: 5,
      type: 'TRANSFER_IN',
      referenceId: transfer1.id,
    },
    {
      productId: createdProducts[13].id,
      destWarehouse: warehouse1.id,
      quantity: 2,
      type: 'ADJUSTMENT',
      referenceId: adjustment1.id,
    },
  ];

  for (const entry of ledgerEntries) {
    await prisma.stockLedger.create({ data: entry });
  }
  console.log(`✅ Created ${ledgerEntries.length} ledger entries`);

  console.log('\n✨ Demo data seeding completed!');
  console.log('\n📋 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👔 MANAGER:');
  console.log('   Email: manager@stockmaster.com');
  console.log('   Password: manager123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👷 WAREHOUSE STAFF:');
  console.log('   Email: staff@stockmaster.com');
  console.log('   Password: staff123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 Demo Data Summary:');
  console.log(`   • 2 Users (Manager + Staff)`);
  console.log(`   • 3 Warehouses`);
  console.log(`   • ${createdProducts.length} Products`);
  console.log(`   • ${stockLevels.length} Stock Level Entries`);
  console.log(`   • 2 Receipts (1 DONE, 1 READY)`);
  console.log(`   • 2 Deliveries (1 DONE, 1 DRAFT)`);
  console.log(`   • 2 Transfers (1 DONE, 1 WAITING)`);
  console.log(`   • 1 Adjustment`);
  console.log(`   • ${ledgerEntries.length} Ledger Entries`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
