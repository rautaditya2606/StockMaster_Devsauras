import express from 'express';
import { z } from 'zod';
import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStock,
} from './warehouse.controller.js';
import { validate } from '../../core/middlewares/validator.js';
import { authenticate } from '../../core/middlewares/auth.js';

const router = express.Router();

const createWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    location: z.string().min(1),
  }),
});

const updateWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
  }),
});

router.get('/', getAllWarehouses);
router.get('/:id', getWarehouseById);
router.post('/', validate(createWarehouseSchema), createWarehouse);
router.put('/:id', validate(updateWarehouseSchema), updateWarehouse);
router.delete('/:id', deleteWarehouse);
router.get('/:id/stock', getWarehouseStock);

// Add logging to debug the /public endpoint
router.get('/public', async (req, res, next) => {
  try {
    console.log('Fetching all warehouses...');
    const warehouses = await warehouseService.getAllWarehouses();
    console.log('Warehouses fetched:', warehouses);
    res.json({ success: true, data: warehouses });
  } catch (error) {
    console.error('Error in /public endpoint:', error);
    next(error);
  }
});

// Apply authentication middleware only to protected routes
router.use((req, res, next) => {
  if (req.path === '/public') {
    return next();
  }
  authenticate(req, res, next);
});

// Ensure this route is defined before any middleware is applied globally.

export default router;

