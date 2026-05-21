import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import pool from "../../config/connection/Index";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(
      token as string,
      process.env.SECRET_KEY as string
    ) as JwtPayload;


    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [decoded.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    
    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};