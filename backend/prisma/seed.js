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
      name: 'Mumbai Central Warehouse',
      location: 'Mumbai, Maharashtra',
    },
  });
  console.log('✅ Created:', warehouse1.name);

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Bengaluru Distribution Centre',
      location: 'Bengaluru, Karnataka',
    },
  });
  console.log('✅ Created:', warehouse2.name);

  const warehouse3 = await prisma.warehouse.create({
    data: {
      name: 'New Delhi Hub',
      location: 'New Delhi, Delhi',
    },
  });
  console.log('✅ Created:', warehouse3.name);

  // Additional warehouses
  const warehouse4 = await prisma.warehouse.create({
    data: {
      name: 'Chennai Regional Warehouse',
      location: 'Chennai, Tamil Nadu',
    },
  });
  console.log('✅ Created:', warehouse4.name);

  const warehouse5 = await prisma.warehouse.create({
    data: {
      name: 'Kolkata Logistics Center',
      location: 'Kolkata, West Bengal',
    },
  });
  console.log('✅ Created:', warehouse5.name);

  const warehouse6 = await prisma.warehouse.create({
    data: {
      name: 'Hyderabad Crossdock',
      location: 'Hyderabad, Telangana',
    },
  });
  console.log('✅ Created:', warehouse6.name);

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
      warehouseId: warehouse1.id, // Assign to Mumbai Central Warehouse
    },
  });
  console.log('✅ Created Warehouse Staff:', staff.email, `(Assigned to: ${warehouse1.name})`);

  // Additional warehouse staff
  const staff2 = await prisma.user.create({
    data: {
      name: 'Chennai Staff',
      email: 'chennai.staff@stockmaster.com',
      password: await bcrypt.hash('staff234', 10),
      role: 'WAREHOUSE_STAFF',
      warehouseId: warehouse4.id,
    },
  });
  console.log('✅ Created Warehouse Staff:', staff2.email, `(Assigned to: ${warehouse4.name})`);

  const staff3 = await prisma.user.create({
    data: {
      name: 'Bengaluru Staff',
      email: 'bengaluru.staff@stockmaster.com',
      password: await bcrypt.hash('staff345', 10),
      role: 'WAREHOUSE_STAFF',
      warehouseId: warehouse2.id,
    },
  });
  console.log('✅ Created Warehouse Staff:', staff3.email, `(Assigned to: ${warehouse2.name})`);

  const staff4 = await prisma.user.create({
    data: {
      name: 'Kolkata Staff',
      email: 'kolkata.staff@stockmaster.com',
      password: await bcrypt.hash('staff456', 10),
      role: 'WAREHOUSE_STAFF',
      warehouseId: warehouse5.id,
    },
  });
  console.log('✅ Created Warehouse Staff:', staff4.email, `(Assigned to: ${warehouse5.name})`);


  // Create Products
  console.log('\n📦 Creating products...');
  // All products are electronics-focused now
  const products = [
    { name: 'Laptop Pro 15"', sku: 'LAP-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Smartphone X', sku: 'PHN-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Tablet S', sku: 'TAB-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Wireless Mouse', sku: 'MOU-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Mechanical Keyboard', sku: 'KEY-001', category: 'Electronics', uom: 'Unit' },
    { name: 'USB-C Cable', sku: 'CAB-001', category: 'Electronics', uom: 'Unit' },
    { name: '27" Monitor', sku: 'MON-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Webcam HD', sku: 'CAM-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Wireless Headphones', sku: 'HPH-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Bluetooth Speaker', sku: 'SPK-001', category: 'Electronics', uom: 'Unit' },
    { name: 'External SSD 1TB', sku: 'SSD-001', category: 'Electronics', uom: 'Unit' },
    { name: 'WiFi Router', sku: 'RTR-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Power Bank 20k', sku: 'PWB-001', category: 'Electronics', uom: 'Unit' },
    { name: 'Smartwatch Z', sku: 'SWT-001', category: 'Electronics', uom: 'Unit' },
    { name: 'HDMI Cable', sku: 'HDM-001', category: 'Electronics', uom: 'Unit' },
    { name: 'USB Hub 4-Port', sku: 'HUB-001', category: 'Electronics', uom: 'Unit' },
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
    // Mumbai Central Warehouse stock
    { product: createdProducts[0], warehouse: warehouse1, quantity: 60 }, // Laptop
    { product: createdProducts[1], warehouse: warehouse1, quantity: 250 }, // Smartphone
    { product: createdProducts[2], warehouse: warehouse1, quantity: 120 }, // Tablet
    { product: createdProducts[3], warehouse: warehouse1, quantity: 220 }, // Mouse
    { product: createdProducts[4], warehouse: warehouse1, quantity: 90 }, // Keyboard
    { product: createdProducts[5], warehouse: warehouse1, quantity: 300 }, // USB-C Cable
    { product: createdProducts[6], warehouse: warehouse1, quantity: 40 }, // Monitor
    { product: createdProducts[7], warehouse: warehouse1, quantity: 150 }, // Webcam
    { product: createdProducts[8], warehouse: warehouse1, quantity: 80 }, // Headphones
    { product: createdProducts[10], warehouse: warehouse1, quantity: 60 }, // External SSD

    // Bengaluru Distribution Centre stock
    { product: createdProducts[0], warehouse: warehouse2, quantity: 40 }, // Laptop
    { product: createdProducts[3], warehouse: warehouse2, quantity: 180 }, // Mouse
    { product: createdProducts[5], warehouse: warehouse2, quantity: 140 }, // USB-C Cable
    { product: createdProducts[6], warehouse: warehouse2, quantity: 30 }, // Monitor
    { product: createdProducts[7], warehouse: warehouse2, quantity: 70 }, // Webcam
    { product: createdProducts[9], warehouse: warehouse2, quantity: 120 }, // Bluetooth Speaker
    { product: createdProducts[11], warehouse: warehouse2, quantity: 50 }, // WiFi Router

    // New Delhi Hub stock
    { product: createdProducts[0], warehouse: warehouse3, quantity: 35 }, // Laptop
    { product: createdProducts[1], warehouse: warehouse3, quantity: 150 }, // Smartphone
    { product: createdProducts[4], warehouse: warehouse3, quantity: 55 }, // Keyboard
    { product: createdProducts[6], warehouse: warehouse3, quantity: 20 }, // Monitor
    { product: createdProducts[8], warehouse: warehouse3, quantity: 90 }, // Headphones

    // Chennai Regional Warehouse stock
    { product: createdProducts[10], warehouse: warehouse4, quantity: 80 }, // External SSD
    { product: createdProducts[11], warehouse: warehouse4, quantity: 60 }, // WiFi Router
    { product: createdProducts[12], warehouse: warehouse4, quantity: 45 }, // Power Bank

    // Kolkata Logistics Center stock
    { product: createdProducts[13], warehouse: warehouse5, quantity: 70 }, // Smartwatch
    { product: createdProducts[14], warehouse: warehouse5, quantity: 200 }, // HDMI Cable

    // Hyderabad Crossdock stock
    { product: createdProducts[15], warehouse: warehouse6, quantity: 120 }, // USB Hub
    { product: createdProducts[9], warehouse: warehouse6, quantity: 60 }, // Bluetooth Speaker
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
          { productId: createdProducts[1].id, quantity: 50 }, // Smartphones
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
          { productId: createdProducts[10].id, quantity: 100 }, // External SSD
          { productId: createdProducts[11].id, quantity: 50 }, // WiFi Router
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
          { productId: createdProducts[6].id, quantity: 5 }, // Monitors
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
          { productId: createdProducts[3].id, quantity: 20 }, // Wireless Mouse
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
          { productId: createdProducts[1].id, quantity: 30 }, // Smartphones
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
          { productId: createdProducts[10].id, quantity: 50 }, // External SSD
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
      productId: createdProducts[8].id, // Wireless Headphones
      prevQty: 80,
      newQty: 82,
      reason: 'Found 2 additional units during inventory count',
      createdBy: manager.id,
    },
  });
  console.log('✅ Created adjustment:', adjustment1.id);

  // Update stock level for adjustment (since adjustments immediately update stock)
  await prisma.stockLevel.update({
    where: {
      productId_warehouseId: {
        productId: createdProducts[8].id,
        warehouseId: warehouse1.id,
      },
    },
    data: { quantity: 82 },
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
      productId: createdProducts[6].id,
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
      productId: createdProducts[8].id,
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
