import type { Request, Response, NextFunction } from "express";

const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission",
      });
    }

    next();
  };
};

export default roleMiddleware;