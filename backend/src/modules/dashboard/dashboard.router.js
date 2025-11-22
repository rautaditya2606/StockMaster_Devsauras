import express from 'express';
import {
  getDashboardKPIs,
  getStockByCategory,
  getStockHistory,
  getWarehouseStockDistribution,
  getTopProducts,
} from './dashboard.controller.js';
import { authenticate } from '../../core/middlewares/auth.js';

const router = express.Router();

router.get('/kpis', authenticate, getDashboardKPIs);
router.get('/charts/stock-by-category', authenticate, getStockByCategory);
router.get('/charts/stock-history', authenticate, getStockHistory);
router.get('/charts/warehouse-distribution', authenticate, getWarehouseStockDistribution);
router.get('/charts/top-products', authenticate, getTopProducts);

export default router;

