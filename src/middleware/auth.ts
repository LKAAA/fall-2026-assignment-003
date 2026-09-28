import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {

  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return next();
  }

  const userIdHeader = req.headers['x-user-id'];

  if (!userIdHeader || Array.isArray(userIdHeader)) {
    res.status(401).json({ error: 'Unauthorized: X-User-Id header missing' });
    return;
  }

  const userId = Number(userIdHeader);

  if (isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
    res.status(401).json({ error: 'Unauthorized: Invalid X-User-Id' });
    return;
  }
  
  res.locals.userId = userId;

  next();
}

export default authMiddleware;
