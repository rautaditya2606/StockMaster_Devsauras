import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './core/middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Import routers
import authRouter from './modules/auth/auth.router.js';
import productRouter from './modules/products/product.router.js';
import warehouseRouter from './modules/warehouses/warehouse.router.js';
import receiptRouter from './modules/inventory/receipts/receipt.router.js';
import deliveryRouter from './modules/inventory/deliveries/delivery.router.js';
import transferRouter from './modules/inventory/transfers/transfer.router.js';
import adjustmentRouter from './modules/inventory/adjustments/adjustment.router.js';
import ledgerRouter from './modules/inventory/ledger/ledger.router.js';
import dashboardRouter from './modules/dashboard/dashboard.router.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes - Version 1
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/warehouses', warehouseRouter);
app.use('/api/v1/receipts', receiptRouter);
app.use('/api/v1/deliveries', deliveryRouter);
app.use('/api/v1/transfers', transferRouter);
app.use('/api/v1/adjustments', adjustmentRouter);
app.use('/api/v1/ledger', ledgerRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

