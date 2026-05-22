import type { Request, Response } from "express";
import {
  createIssuesService,
  deleteIssuesService,
  getAllIssuesService,
  getIssuesByIdService,
  updateIssueService,
} from "./issues.service";
import type { IUser } from "../user/user.interface";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const createIssuesController = async (
  req: AuthenticatedRequest,
  res: Response,
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
    const result = await getAllIssuesService(req.query);

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
const getIssuesByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Issue id is required",
      });
    }

    const result = await getIssuesByIdService(id as string);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("GetIssuesByIdController Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const updateIssueController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await updateIssueService(id as string, req.body);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const deleteIssueController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteIssuesService(id as string);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json(error);
  }
};

export {
  createIssuesController,
  getIssuesController,
  getIssuesByIdController,
  updateIssueController,
  deleteIssueController,
};
