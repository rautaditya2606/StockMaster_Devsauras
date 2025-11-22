import express from 'express';
import { z } from 'zod';
import {
  getAllAdjustments,
  getAdjustmentById,
  createAdjustment,
} from './adjustment.controller.js';
import { validate } from '../../../core/middlewares/validator.js';
import { authenticate } from '../../../core/middlewares/auth.js';

const router = express.Router();

const createAdjustmentSchema = z.object({
  body: z.object({
    warehouseId: z.string().min(1),
    productId: z.string().min(1),
    newQty: z.number().int().min(0),
    reason: z.string().optional(),
  }),
});

router.get('/', authenticate, getAllAdjustments);
router.get('/:id', authenticate, getAdjustmentById);
router.post('/', authenticate, validate(createAdjustmentSchema), createAdjustment);

export default router;

