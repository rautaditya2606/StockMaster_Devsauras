import express from 'express';
import { z } from 'zod';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStockLevels,
} from './product.controller.js';
import { validate } from '../../core/middlewares/validator.js';
import { authenticate } from '../../core/middlewares/auth.js';

const router = express.Router();

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    category: z.string().min(1),
    uom: z.string().min(1),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    uom: z.string().min(1).optional(),
  }),
});

router.get('/', authenticate, getAllProducts);
router.get('/:id', authenticate, getProductById);
router.post('/', authenticate, validate(createProductSchema), createProduct);
router.put('/:id', authenticate, validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.get('/:id/stock-levels', authenticate, getProductStockLevels);

export default router;

