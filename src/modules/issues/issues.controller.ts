import type { Request, Response } from "express";
import { createIssuesService, getAllIssuesService } from "./issues.service";
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
const getIssuesController = async (req: Request, res: Response) => {
  try {
    const result = await getAllIssuesService();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("GetIssuesController Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { createIssuesController,getIssuesController };