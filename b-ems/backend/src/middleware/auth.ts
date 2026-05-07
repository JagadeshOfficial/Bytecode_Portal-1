import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${user?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
