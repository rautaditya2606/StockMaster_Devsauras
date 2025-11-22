import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './core/middlewares/errorHandler.js';
import { cacheMiddleware, getCacheDuration } from './core/middlewares/cache.js';
import { authenticate } from './core/middlewares/auth.js';

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
import taskRouter from './modules/tasks/task.router.js';
import userRouter from './modules/users/user.router.js';

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

// API Routes - Version 1 (with caching)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', cacheMiddleware(getCacheDuration('/products')), productRouter);
app.use('/api/v1/warehouses', cacheMiddleware(getCacheDuration('/warehouses')), warehouseRouter);
app.use('/api/v1/receipts', cacheMiddleware(getCacheDuration('/receipts')), receiptRouter);
app.use('/api/v1/deliveries', cacheMiddleware(getCacheDuration('/deliveries')), deliveryRouter);
app.use('/api/v1/transfers', cacheMiddleware(getCacheDuration('/transfers')), transferRouter);
app.use('/api/v1/adjustments', cacheMiddleware(getCacheDuration('/adjustments')), adjustmentRouter);
app.use('/api/v1/ledger', cacheMiddleware(getCacheDuration('/ledger')), ledgerRouter);
app.use('/api/v1/dashboard', cacheMiddleware(getCacheDuration('/dashboard/kpis')), dashboardRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

// Direct public warehouse route
app.use('/api/public/warehouses', warehouseRouter);

// Apply authentication middleware only to protected routes
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/public/warehouses/public')) {
    return next();
  }
  authenticate(req, res, next);
});

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

