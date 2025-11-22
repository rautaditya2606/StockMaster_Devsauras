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

router.get('/', authenticate, getAllWarehouses);
router.get('/:id', authenticate, getWarehouseById);
router.post('/', authenticate, validate(createWarehouseSchema), createWarehouse);
router.put('/:id', authenticate, validate(updateWarehouseSchema), updateWarehouse);
router.delete('/:id', authenticate, deleteWarehouse);
router.get('/:id/stock', authenticate, getWarehouseStock);

export default router;

