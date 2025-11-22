import express from 'express';
import { z } from 'zod';
import { signupController, loginController } from './auth.controller.js';
import { validate } from '../../core/middlewares/validator.js';

const router = express.Router();

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['MANAGER', 'WAREHOUSE_STAFF']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);

export default router;

