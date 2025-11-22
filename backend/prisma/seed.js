import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...\n');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.task.deleteMany();
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

  // Create a sample task
  const task = await prisma.task.create({
    data: {
      title: 'Sample Task',
      description: 'This is a sample task',
      assignedToId: staff.id,
      assignedById: manager.id,
    },
  });
  console.log('✅ Created sample task:', task.id);


  // Create Products
  console.log('\n📦 Creating products...');
  // Electronics products organized by category
  const products = [
    // Mobile Category (Mobiles and Mobile Accessories)
    { name: 'iPhone 15 Pro', sku: 'MOB-001', category: 'Mobile', uom: 'Unit' },
    { name: 'Samsung Galaxy S24 Ultra', sku: 'MOB-002', category: 'Mobile', uom: 'Unit' },
    { name: 'OnePlus 12', sku: 'MOB-003', category: 'Mobile', uom: 'Unit' },
    { name: 'Google Pixel 8 Pro', sku: 'MOB-004', category: 'Mobile', uom: 'Unit' },
    { name: 'Xiaomi 14 Pro', sku: 'MOB-005', category: 'Mobile', uom: 'Unit' },
    { name: 'Phone Case iPhone 15', sku: 'MOB-ACC-001', category: 'Mobile', uom: 'Unit' },
    { name: 'Phone Case Samsung S24', sku: 'MOB-ACC-002', category: 'Mobile', uom: 'Unit' },
    { name: 'Screen Protector Tempered Glass', sku: 'MOB-ACC-003', category: 'Mobile', uom: 'Pack' },
    { name: 'Wireless Charger 15W', sku: 'MOB-ACC-004', category: 'Mobile', uom: 'Unit' },
    { name: 'Phone Stand Adjustable', sku: 'MOB-ACC-005', category: 'Mobile', uom: 'Unit' },
    { name: 'USB-C to Lightning Cable', sku: 'MOB-ACC-006', category: 'Mobile', uom: 'Unit' },
    { name: 'Power Bank 20000mAh', sku: 'MOB-ACC-007', category: 'Mobile', uom: 'Unit' },
    { name: 'Mobile Camera Lens Kit', sku: 'MOB-ACC-008', category: 'Mobile', uom: 'Set' },
    { name: 'Selfie Stick Bluetooth', sku: 'MOB-ACC-009', category: 'Mobile', uom: 'Unit' },
    
    // Laptop Category (Laptops and Laptop Accessories)
    { name: 'MacBook Pro 16" M3', sku: 'LAP-001', category: 'Laptop', uom: 'Unit' },
    { name: 'Dell XPS 15', sku: 'LAP-002', category: 'Laptop', uom: 'Unit' },
    { name: 'HP Spectre x360', sku: 'LAP-003', category: 'Laptop', uom: 'Unit' },
    { name: 'Lenovo ThinkPad X1 Carbon', sku: 'LAP-004', category: 'Laptop', uom: 'Unit' },
    { name: 'ASUS ROG Strix G16', sku: 'LAP-005', category: 'Laptop', uom: 'Unit' },
    { name: 'Laptop Sleeve 15"', sku: 'LAP-ACC-001', category: 'Laptop', uom: 'Unit' },
    { name: 'Laptop Stand Aluminum', sku: 'LAP-ACC-002', category: 'Laptop', uom: 'Unit' },
    { name: 'USB-C Hub 7-in-1', sku: 'LAP-ACC-003', category: 'Laptop', uom: 'Unit' },
    { name: 'Laptop Cooling Pad', sku: 'LAP-ACC-004', category: 'Laptop', uom: 'Unit' },
    { name: 'Laptop Bag Backpack', sku: 'LAP-ACC-005', category: 'Laptop', uom: 'Unit' },
    { name: 'External SSD 1TB', sku: 'LAP-ACC-006', category: 'Laptop', uom: 'Unit' },
    { name: 'Wireless Mouse Logitech MX Master', sku: 'LAP-ACC-007', category: 'Laptop', uom: 'Unit' },
    { name: 'Mechanical Keyboard RGB', sku: 'LAP-ACC-008', category: 'Laptop', uom: 'Unit' },
    { name: 'Laptop Charger Universal', sku: 'LAP-ACC-009', category: 'Laptop', uom: 'Unit' },
    { name: 'Laptop Webcam 1080p', sku: 'LAP-ACC-010', category: 'Laptop', uom: 'Unit' },
    
    // Gaming Console Category
    { name: 'PlayStation 5 Console', sku: 'GAM-001', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Xbox Series X', sku: 'GAM-002', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Nintendo Switch OLED', sku: 'GAM-003', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Steam Deck 512GB', sku: 'GAM-004', category: 'Gaming Console', uom: 'Unit' },
    { name: 'PS5 DualSense Controller', sku: 'GAM-ACC-001', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Xbox Wireless Controller', sku: 'GAM-ACC-002', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Gaming Headset PS5', sku: 'GAM-ACC-003', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Gaming Chair Ergonomic', sku: 'GAM-ACC-004', category: 'Gaming Console', uom: 'Unit' },
    { name: 'PS5 Game - Spiderman 2', sku: 'GAM-GM-001', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Xbox Game - Forza Horizon 5', sku: 'GAM-GM-002', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Nintendo Switch Game Card', sku: 'GAM-GM-003', category: 'Gaming Console', uom: 'Unit' },
    { name: 'Console Storage Expansion 1TB', sku: 'GAM-ACC-005', category: 'Gaming Console', uom: 'Unit' },
    
    // Study Related Electronics
    { name: 'Arduino Uno R3', sku: 'STU-001', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Raspberry Pi 4 Model B 8GB', sku: 'STU-002', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'NVIDIA Jetson Nano Developer Kit', sku: 'STU-003', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'ESP32 Development Board', sku: 'STU-004', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Arduino Mega 2560', sku: 'STU-005', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Breadboard 830 Points', sku: 'STU-ACC-001', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Jumper Wires Set', sku: 'STU-ACC-002', category: 'Study Related Electronics', uom: 'Pack' },
    { name: 'Resistor Kit 1/4W', sku: 'STU-ACC-003', category: 'Study Related Electronics', uom: 'Pack' },
    { name: 'LED Kit Assorted Colors', sku: 'STU-ACC-004', category: 'Study Related Electronics', uom: 'Pack' },
    { name: 'Multimeter Digital', sku: 'STU-ACC-005', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Soldering Iron Kit', sku: 'STU-ACC-006', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'MicroSD Card 64GB Class 10', sku: 'STU-ACC-007', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Raspberry Pi Case with Fan', sku: 'STU-ACC-008', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Arduino Sensor Kit', sku: 'STU-ACC-009', category: 'Study Related Electronics', uom: 'Set' },
    { name: 'GPIO Expansion Board', sku: 'STU-ACC-010', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'OLED Display 128x64', sku: 'STU-ACC-011', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Servo Motor SG90', sku: 'STU-ACC-012', category: 'Study Related Electronics', uom: 'Unit' },
    { name: 'Stepper Motor NEMA 17', sku: 'STU-ACC-013', category: 'Study Related Electronics', uom: 'Unit' },
    
    // Camera Category
    { name: 'Canon EOS R5 Camera', sku: 'CAM-001', category: 'Camera', uom: 'Unit' },
    { name: 'Sony Alpha A7 IV', sku: 'CAM-002', category: 'Camera', uom: 'Unit' },
    { name: 'Nikon Z6 II', sku: 'CAM-003', category: 'Camera', uom: 'Unit' },
    { name: 'GoPro Hero 12', sku: 'CAM-004', category: 'Camera', uom: 'Unit' },
    { name: 'Fujifilm X-T5', sku: 'CAM-005', category: 'Camera', uom: 'Unit' },
    { name: 'Canon RF 24-70mm f/2.8 Lens', sku: 'CAM-ACC-001', category: 'Camera', uom: 'Unit' },
    { name: 'Sony FE 50mm f/1.8 Lens', sku: 'CAM-ACC-002', category: 'Camera', uom: 'Unit' },
    { name: 'Camera Tripod Carbon Fiber', sku: 'CAM-ACC-003', category: 'Camera', uom: 'Unit' },
    { name: 'Camera Bag Professional', sku: 'CAM-ACC-004', category: 'Camera', uom: 'Unit' },
    { name: 'SD Card 128GB UHS-II', sku: 'CAM-ACC-005', category: 'Camera', uom: 'Unit' },
    { name: 'Camera Battery Pack', sku: 'CAM-ACC-006', category: 'Camera', uom: 'Unit' },
    { name: 'Camera Strap Professional', sku: 'CAM-ACC-007', category: 'Camera', uom: 'Unit' },
    { name: 'Camera Flash External', sku: 'CAM-ACC-008', category: 'Camera', uom: 'Unit' },
    { name: 'Lens Cleaning Kit', sku: 'CAM-ACC-009', category: 'Camera', uom: 'Set' },
    { name: 'Camera Remote Shutter', sku: 'CAM-ACC-010', category: 'Camera', uom: 'Unit' },
    { name: 'Camera Gimbal Stabilizer', sku: 'CAM-ACC-011', category: 'Camera', uom: 'Unit' },
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
    // Main Warehouse stock - Mobile products
    { product: createdProducts[0], warehouse: warehouse1, quantity: 45 }, // iPhone 15 Pro
    { product: createdProducts[1], warehouse: warehouse1, quantity: 50 }, // Samsung Galaxy S24
    { product: createdProducts[2], warehouse: warehouse1, quantity: 35 }, // OnePlus 12
    { product: createdProducts[5], warehouse: warehouse1, quantity: 200 }, // Phone Case iPhone
    { product: createdProducts[6], warehouse: warehouse1, quantity: 180 }, // Phone Case Samsung
    { product: createdProducts[7], warehouse: warehouse1, quantity: 300 }, // Screen Protector
    { product: createdProducts[8], warehouse: warehouse1, quantity: 120 }, // Wireless Charger
    { product: createdProducts[11], warehouse: warehouse1, quantity: 150 }, // Power Bank
    
    // Main Warehouse stock - Laptop products
    { product: createdProducts[14], warehouse: warehouse1, quantity: 25 }, // MacBook Pro
    { product: createdProducts[15], warehouse: warehouse1, quantity: 30 }, // Dell XPS
    { product: createdProducts[20], warehouse: warehouse1, quantity: 80 }, // Laptop Sleeve
    { product: createdProducts[21], warehouse: warehouse1, quantity: 60 }, // Laptop Stand
    { product: createdProducts[22], warehouse: warehouse1, quantity: 100 }, // USB-C Hub
    { product: createdProducts[25], warehouse: warehouse1, quantity: 70 }, // External SSD
    { product: createdProducts[26], warehouse: warehouse1, quantity: 90 }, // Wireless Mouse
    { product: createdProducts[27], warehouse: warehouse1, quantity: 50 }, // Mechanical Keyboard
    
    // Main Warehouse stock - Gaming Console products
    { product: createdProducts[29], warehouse: warehouse1, quantity: 20 }, // PS5
    { product: createdProducts[30], warehouse: warehouse1, quantity: 18 }, // Xbox Series X
    { product: createdProducts[33], warehouse: warehouse1, quantity: 40 }, // PS5 Controller
    { product: createdProducts[34], warehouse: warehouse1, quantity: 35 }, // Xbox Controller
    { product: createdProducts[37], warehouse: warehouse1, quantity: 25 }, // PS5 Game
    
    // Main Warehouse stock - Study Related Electronics
    { product: createdProducts[42], warehouse: warehouse1, quantity: 80 }, // Arduino Uno
    { product: createdProducts[43], warehouse: warehouse1, quantity: 60 }, // Raspberry Pi 4
    { product: createdProducts[44], warehouse: warehouse1, quantity: 15 }, // NVIDIA Jetson
    { product: createdProducts[47], warehouse: warehouse1, quantity: 100 }, // Breadboard
    { product: createdProducts[48], warehouse: warehouse1, quantity: 150 }, // Jumper Wires
    { product: createdProducts[49], warehouse: warehouse1, quantity: 200 }, // Resistor Kit
    { product: createdProducts[50], warehouse: warehouse1, quantity: 180 }, // LED Kit
    { product: createdProducts[51], warehouse: warehouse1, quantity: 40 }, // Multimeter
    { product: createdProducts[53], warehouse: warehouse1, quantity: 120 }, // MicroSD Card
    
    // Main Warehouse stock - Camera products
    { product: createdProducts[60], warehouse: warehouse1, quantity: 12 }, // Canon EOS R5
    { product: createdProducts[61], warehouse: warehouse1, quantity: 15 }, // Sony Alpha A7
    { product: createdProducts[64], warehouse: warehouse1, quantity: 25 }, // GoPro Hero 12
    { product: createdProducts[65], warehouse: warehouse1, quantity: 20 }, // Canon RF Lens
    { product: createdProducts[67], warehouse: warehouse1, quantity: 30 }, // Camera Tripod
    { product: createdProducts[69], warehouse: warehouse1, quantity: 50 }, // SD Card
    { product: createdProducts[73], warehouse: warehouse1, quantity: 40 }, // Lens Cleaning Kit

    // West Coast Distribution stock
    { product: createdProducts[0], warehouse: warehouse2, quantity: 30 }, // iPhone
    { product: createdProducts[14], warehouse: warehouse2, quantity: 20 }, // MacBook
    { product: createdProducts[29], warehouse: warehouse2, quantity: 15 }, // PS5
    { product: createdProducts[42], warehouse: warehouse2, quantity: 50 }, // Arduino
    { product: createdProducts[60], warehouse: warehouse2, quantity: 8 }, // Canon Camera
    { product: createdProducts[5], warehouse: warehouse2, quantity: 150 }, // Phone Case
    { product: createdProducts[20], warehouse: warehouse2, quantity: 60 }, // Laptop Sleeve
    { product: createdProducts[47], warehouse: warehouse2, quantity: 80 }, // Breadboard

    // New Delhi Hub stock
    { product: createdProducts[1], warehouse: warehouse3, quantity: 25 }, // Samsung
    { product: createdProducts[15], warehouse: warehouse3, quantity: 18 }, // Dell XPS
    { product: createdProducts[30], warehouse: warehouse3, quantity: 12 }, // Xbox
    { product: createdProducts[43], warehouse: warehouse3, quantity: 40 }, // Raspberry Pi
    { product: createdProducts[61], warehouse: warehouse3, quantity: 10 }, // Sony Camera
    { product: createdProducts[6], warehouse: warehouse3, quantity: 120 }, // Phone Case
    { product: createdProducts[21], warehouse: warehouse3, quantity: 45 }, // Laptop Stand
    { product: createdProducts[48], warehouse: warehouse3, quantity: 100 }, // Jumper Wires
    { product: createdProducts[2], warehouse: warehouse3, quantity: 20 }, // OnePlus
    { product: createdProducts[33], warehouse: warehouse3, quantity: 25 }, // PS5 Controller

    // Chennai Regional Warehouse stock
    { product: createdProducts[3], warehouse: warehouse4, quantity: 18 }, // Google Pixel
    { product: createdProducts[16], warehouse: warehouse4, quantity: 15 }, // HP Spectre
    { product: createdProducts[31], warehouse: warehouse4, quantity: 10 }, // Nintendo Switch
    { product: createdProducts[44], warehouse: warehouse4, quantity: 8 }, // ESP32
    { product: createdProducts[62], warehouse: warehouse4, quantity: 8 }, // Nikon Z6
    { product: createdProducts[8], warehouse: warehouse4, quantity: 80 }, // Wireless Charger
    { product: createdProducts[22], warehouse: warehouse4, quantity: 70 }, // USB-C Hub
    { product: createdProducts[47], warehouse: warehouse4, quantity: 60 }, // Breadboard

    // Kolkata Logistics Center stock
    { product: createdProducts[4], warehouse: warehouse5, quantity: 15 }, // Xiaomi
    { product: createdProducts[17], warehouse: warehouse5, quantity: 12 }, // Lenovo ThinkPad
    { product: createdProducts[32], warehouse: warehouse5, quantity: 8 }, // Steam Deck
    { product: createdProducts[45], warehouse: warehouse5, quantity: 10 }, // Arduino Mega
    { product: createdProducts[63], warehouse: warehouse5, quantity: 6 }, // GoPro
    { product: createdProducts[9], warehouse: warehouse5, quantity: 60 }, // Phone Stand
    { product: createdProducts[23], warehouse: warehouse5, quantity: 50 }, // Cooling Pad
    { product: createdProducts[52], warehouse: warehouse5, quantity: 30 }, // MicroSD Card

    // Hyderabad Crossdock stock
    { product: createdProducts[5], warehouse: warehouse6, quantity: 100 }, // Phone Case iPhone
    { product: createdProducts[18], warehouse: warehouse6, quantity: 10 }, // ASUS ROG
    { product: createdProducts[35], warehouse: warehouse6, quantity: 20 }, // Gaming Headset
    { product: createdProducts[46], warehouse: warehouse6, quantity: 50 }, // Breadboard
    { product: createdProducts[64], warehouse: warehouse6, quantity: 12 }, // Fujifilm
    { product: createdProducts[11], warehouse: warehouse6, quantity: 80 }, // Power Bank
    { product: createdProducts[24], warehouse: warehouse6, quantity: 40 }, // Laptop Bag
    { product: createdProducts[49], warehouse: warehouse6, quantity: 120 }, // Resistor Kit


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

  let createdCount = 0;
  for (const stock of stockLevels) {
    // Use upsert to avoid duplicate unique constraint errors if the pair exists
    const productId = stock.product.id;
    const warehouseId = stock.warehouse.id;
    await prisma.stockLevel.upsert({
      where: {
        productId_warehouseId: { productId, warehouseId },
      },
      update: { quantity: stock.quantity },
      create: {
        productId,
        warehouseId,
        quantity: stock.quantity,
      },
    });
    createdCount++;
  }
  console.log(`✅ Ensured ${createdCount} stock level entries (created or updated)`);

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
          { productId: createdProducts[0].id, quantity: 15 }, // iPhone 15 Pro
          { productId: createdProducts[14].id, quantity: 10 }, // MacBook Pro
          { productId: createdProducts[42].id, quantity: 30 }, // Arduino Uno
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
          { productId: createdProducts[29].id, quantity: 8 }, // PS5 Console
          { productId: createdProducts[60].id, quantity: 5 }, // Canon EOS R5
          { productId: createdProducts[43].id, quantity: 25 }, // Raspberry Pi 4
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
          { productId: createdProducts[0].id, quantity: 5 }, // iPhone 15 Pro
          { productId: createdProducts[14].id, quantity: 3 }, // MacBook Pro
          { productId: createdProducts[29].id, quantity: 2 }, // PS5 Console
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
          { productId: createdProducts[1].id, quantity: 10 }, // Samsung Galaxy S24
          { productId: createdProducts[26].id, quantity: 15 }, // Wireless Mouse
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
          { productId: createdProducts[1].id, quantity: 10 }, // Samsung Galaxy S24
          { productId: createdProducts[15].id, quantity: 5 }, // Dell XPS 15
          { productId: createdProducts[42].id, quantity: 20 }, // Arduino Uno
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
          { productId: createdProducts[43].id, quantity: 15 }, // Raspberry Pi 4
          { productId: createdProducts[60].id, quantity: 2 }, // Canon EOS R5
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
      productId: createdProducts[7].id, // Screen Protector
      prevQty: 300,
      newQty: 320,
      reason: 'Found 2 additional units during inventory count',
      createdBy: manager.id,
    },
  });
  console.log('✅ Created adjustment:', adjustment1.id);

  // --- Add stock activity for other warehouses to ensure they have history ---
  console.log('\n➕ Adding activity to other warehouses...');

  const warehousesToSeed = [warehouse3, warehouse4, warehouse5, warehouse6];
  const productsToUse = createdProducts.slice(0, 5); // Use a few products for seeding

  for (const warehouse of warehousesToSeed) {
    // Create a receipt
    const receipt = await prisma.receipt.create({
      data: {
        supplierName: 'Local Electronics Co.',
        warehouseId: warehouse.id,
        createdBy: manager.id,
        status: 'DONE',
        items: {
          create: productsToUse.map(p => ({ productId: p.id, quantity: Math.floor(Math.random() * 50) + 10 })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create ledger entries for the receipt
    for (const item of receipt.items) {
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          destWarehouse: warehouse.id,
          quantity: item.quantity,
          type: 'RECEIPT',
          referenceId: receipt.id,
        },
      });
    }

    // Create an adjustment
    const productToAdjust = productsToUse[0];
    const stockLevel = await prisma.stockLevel.findFirst({ where: { warehouseId: warehouse.id, productId: productToAdjust.id } });
    if (stockLevel) {
      const prevQty = stockLevel.quantity;
      const newQty = prevQty + 10;
      const adjustment = await prisma.adjustment.create({
        data: {
          warehouseId: warehouse.id,
          productId: productToAdjust.id,
          prevQty,
          newQty,
          reason: 'Stock correction',
          createdBy: manager.id,
        },
      });

      // Create ledger entry for the adjustment
      await prisma.stockLedger.create({
        data: {
          productId: productToAdjust.id,
          destWarehouse: warehouse.id,
          quantity: 10,
          type: 'ADJUSTMENT',
          referenceId: adjustment.id,
        },
      });

      // Update stock level
      await prisma.stockLevel.update({
        where: { id: stockLevel.id },
        data: { quantity: newQty },
      });
    }
    console.log(`✅ Added activity for ${warehouse.name}`);
  }

  // Update stock level for adjustment (since adjustments immediately update stock)
  await prisma.stockLevel.update({
    where: {
      productId_warehouseId: {
        productId: createdProducts[7].id,
        warehouseId: warehouse1.id,
      },
    },
    data: { quantity: 320 },
  });

  // Create Ledger Entries for demo
  console.log('\n📝 Creating ledger entries...');
  const ledgerEntries = [
    {
      productId: createdProducts[0].id,
      destWarehouse: warehouse1.id,
      quantity: 15,
      type: 'RECEIPT',
      referenceId: receipt1.id,
    },
    {
      productId: createdProducts[14].id,
      destWarehouse: warehouse1.id,
      quantity: 10,
      type: 'RECEIPT',
      referenceId: receipt1.id,
    },
    {
      productId: createdProducts[42].id,
      destWarehouse: warehouse1.id,
      quantity: 30,
      type: 'RECEIPT',
      referenceId: receipt1.id,
    },
    {
      productId: createdProducts[0].id,
      sourceWarehouse: warehouse1.id,
      quantity: 5,
      type: 'DELIVERY',
      referenceId: delivery1.id,
    },
    {
      productId: createdProducts[14].id,
      sourceWarehouse: warehouse1.id,
      quantity: 3,
      type: 'DELIVERY',
      referenceId: delivery1.id,
    },
    {
      productId: createdProducts[29].id,
      sourceWarehouse: warehouse1.id,
      quantity: 2,
      type: 'DELIVERY',
      referenceId: delivery1.id,
    },
    {
      productId: createdProducts[1].id,
      sourceWarehouse: warehouse1.id,
      quantity: 10,
      type: 'TRANSFER_OUT',
      referenceId: transfer1.id,
    },
    {
      productId: createdProducts[1].id,
      destWarehouse: warehouse2.id,
      quantity: 10,
      type: 'TRANSFER_IN',
      referenceId: transfer1.id,
    },
    {
      productId: createdProducts[15].id,
      sourceWarehouse: warehouse1.id,
      quantity: 5,
      type: 'TRANSFER_OUT',
      referenceId: transfer1.id,
    },
    {
      productId: createdProducts[15].id,
      destWarehouse: warehouse2.id,
      quantity: 5,
      type: 'TRANSFER_IN',
      referenceId: transfer1.id,
    },
    {
      productId: createdProducts[7].id,
      destWarehouse: warehouse1.id,
      quantity: 20,
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
