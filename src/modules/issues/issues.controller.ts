import type { Request, Response } from "express";
import { createIssuesService } from "./issues.service";
import type { IUser } from "../user/user.interface";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const createIssuesController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const result = await createIssuesService(req.body, req.user as IUser);

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export { createIssuesController };