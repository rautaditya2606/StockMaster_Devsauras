# StockMaster - Inventory Management System

A complete, production-grade Inventory Management System built with Next.js 14+ and Node.js + Express.

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with App Router
- **Backend**: Node.js + Express (JavaScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Validation**: Zod schema validation
- **API Style**: REST, versioned at `/api/v1/*`

## 📁 Project Structure

```
stock_master_Devsauras/
├── backend/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── products/
│       │   ├── warehouses/
│       │   ├── inventory/
│       │   │   ├── receipts/
│       │   │   ├── deliveries/
│       │   │   ├── transfers/
│       │   │   ├── adjustments/
│       │   │   └── ledger/
│       │   └── dashboard/
│       ├── core/
│       │   ├── db/
│       │   ├── middlewares/
│       │   ├── utils/
│       │   ├── validators/
│       │   └── errors/
│       └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── styles/
├── prisma/
│   └── schema.prisma
└── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone and Setup

```bash
cd stock_master_Devsauras
```

### 2. Database Setup

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL on port 5432 with:
- User: `postgres`
- Password: `postgres`
- Database: `stock_master`

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set your configuration
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stock_master?schema=public"
# JWT_SECRET="your-secret-key"

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📊 Features

### Core Modules

1. **Authentication**
   - User signup/login
   - JWT-based authentication
   - Role-based access control (Manager, Warehouse Staff)

2. **Product Management**
   - CRUD operations for products
   - SKU management
   - Category and UOM tracking
   - Stock levels per warehouse

3. **Warehouse Management**
   - Multi-warehouse support
   - Warehouse CRUD operations
   - Stock tracking per warehouse

4. **Inventory Operations**
   - **Receipts**: Incoming stock management
   - **Deliveries**: Outgoing stock management
   - **Transfers**: Inter-warehouse stock transfers
   - **Adjustments**: Manual stock corrections
   - **Ledger**: Immutable audit log of all stock movements

5. **Dashboard**
   - KPIs and metrics
   - Low stock alerts
   - Pending documents overview
   - Stock by warehouse
   - Category breakdown

### Document State Machine

All inventory documents (Receipts, Deliveries, Transfers) follow a state machine:

```
DRAFT → WAITING → READY → DONE
  ↓        ↓        ↓
CANCELED  CANCELED  CANCELED
```

- Only documents in `DONE` status modify stock levels
- Stock mutations are ACID-compliant and transactional
- All stock changes are logged in the stock ledger

### Stock Operations

All stock operations are wrapped in Prisma transactions to ensure ACID compliance:

- **Receipts**: Increase stock in destination warehouse
- **Deliveries**: Decrease stock from source warehouse (with availability validation)
- **Transfers**: Decrease from source, increase in destination (with availability validation)
- **Adjustments**: Direct quantity updates with audit trail

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user
- `POST /api/v1/auth/login` - Login user

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/:id/stock-levels` - Get stock levels for product

### Warehouses
- `GET /api/v1/warehouses` - List all warehouses
- `GET /api/v1/warehouses/:id` - Get warehouse details
- `POST /api/v1/warehouses` - Create warehouse
- `PUT /api/v1/warehouses/:id` - Update warehouse
- `DELETE /api/v1/warehouses/:id` - Delete warehouse
- `GET /api/v1/warehouses/:id/stock` - Get stock in warehouse

### Receipts
- `GET /api/v1/receipts` - List all receipts
- `GET /api/v1/receipts/:id` - Get receipt details
- `POST /api/v1/receipts` - Create receipt
- `POST /api/v1/receipts/:id/items` - Add item to receipt
- `PUT /api/v1/receipts/:id/status` - Update receipt status
- `POST /api/v1/receipts/:id/validate` - Validate receipt (updates stock)
- `DELETE /api/v1/receipts/:id/items/:itemId` - Delete receipt item

### Deliveries
- `GET /api/v1/deliveries` - List all deliveries
- `GET /api/v1/deliveries/:id` - Get delivery details
- `POST /api/v1/deliveries` - Create delivery
- `POST /api/v1/deliveries/:id/items` - Add item to delivery
- `PUT /api/v1/deliveries/:id/status` - Update delivery status
- `POST /api/v1/deliveries/:id/validate` - Validate delivery (updates stock)
- `DELETE /api/v1/deliveries/:id/items/:itemId` - Delete delivery item

### Transfers
- `GET /api/v1/transfers` - List all transfers
- `GET /api/v1/transfers/:id` - Get transfer details
- `POST /api/v1/transfers` - Create transfer
- `POST /api/v1/transfers/:id/items` - Add item to transfer
- `PUT /api/v1/transfers/:id/status` - Update transfer status
- `POST /api/v1/transfers/:id/validate` - Validate transfer (updates stock)
- `DELETE /api/v1/transfers/:id/items/:itemId` - Delete transfer item

### Adjustments
- `GET /api/v1/adjustments` - List all adjustments
- `GET /api/v1/adjustments/:id` - Get adjustment details
- `POST /api/v1/adjustments` - Create adjustment (immediately updates stock)

### Ledger
- `GET /api/v1/ledger` - Get all ledger entries
- `GET /api/v1/ledger/product/:productId` - Get product ledger
- `GET /api/v1/ledger/warehouse/:warehouseId` - Get warehouse ledger

### Dashboard
- `GET /api/v1/dashboard/kpis` - Get dashboard KPIs

## 🗄️ Database Schema

The system uses the following main models:

- **users**: User accounts with roles
- **warehouses**: Warehouse locations
- **products**: Product catalog
- **stock_levels**: Current stock per product/warehouse
- **receipts** & **receipt_items**: Incoming stock documents
- **deliveries** & **delivery_items**: Outgoing stock documents
- **transfers** & **transfer_items**: Inter-warehouse transfers
- **adjustments**: Manual stock adjustments
- **stock_ledger**: Immutable audit log

## 🔒 Security

- JWT authentication for all protected routes
- Password hashing with bcrypt
- Role-based access control
- Input validation with Zod
- CORS and Helmet for security headers
- SQL injection protection via Prisma

## 🧪 Development

### Backend Scripts

```bash
npm run dev          # Start development server with watch mode
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio
```

### Frontend Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run linter
```

## 📝 Environment Variables

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stock_master?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 🎯 Usage Workflow

1. **Setup**: Start database and install dependencies
2. **Create Users**: Sign up via `/login` page
3. **Create Warehouses**: Add warehouse locations
4. **Create Products**: Add products to the catalog
5. **Manage Inventory**:
   - Create receipts for incoming stock
   - Create deliveries for outgoing stock
   - Create transfers between warehouses
   - Make adjustments for corrections
6. **Monitor**: View dashboard for KPIs and alerts

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure Docker Compose is running: `docker-compose ps`
- Check DATABASE_URL in backend/.env
- Verify PostgreSQL is accessible: `docker-compose logs postgres`

### Prisma Issues

- Regenerate Prisma Client: `npm run prisma:generate`
- Reset database: `npm run prisma:migrate reset` (⚠️ deletes all data)

### Frontend API Errors

- Verify backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Verify JWT token is stored in localStorage

## 📄 License

ISC

## 👥 Contributing

This is a production-grade system. Follow clean architecture principles and maintain code quality.

---

**Built with ❤️ for efficient inventory management**
