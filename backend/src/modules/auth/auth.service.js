import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../core/db/prisma.js';
import { ValidationError, UnauthorizedError } from '../../core/errors/AppError.js';

export const signup = async (data) => {
  const { name, email, password, role } = data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ValidationError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'WAREHOUSE_STAFF',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const login = async (data) => {
  const { email, password } = data;

  // Find user with warehouse
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      warehouse: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      warehouseId: user.warehouseId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      warehouseId: user.warehouseId,
    },
    token,
  };
};

