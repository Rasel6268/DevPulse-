import pool from "../../config/connection/Index";
import type { IUser } from "../user/user.interface";
import type { CreateIssue } from "./createIssue.interface";
import type { UpdateIssue } from "./updateIssue.interface";


const createIssuesService = async (issuesData: CreateIssue, userData: IUser) => {
  try {
    const { title, description, type } = issuesData;
    if (!title || !description || !type) {
      return {
        success: false,
        message: "Title, description, and type are required.",
      };
    }
    const reporter_id = userData.id;
    const res = await pool.query(
      `
      INSERT INTO issues (title,description,type,reporter_id)  VALUES ($1, $2, $3, $4)  RETURNING *
      `,
      [title, description, type, reporter_id],
    );
    const issues = res.rows[0];
    return {
      success: true,
      message: "Issues Create successfull!",
      issues: issues,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
};
const getAllIssuesService = async () => {
  try {
    const result = await pool.query(`
      SELECT * FROM issues
    `);

    if (result.rows.length === 0) {
      return {
        success: true,
        message: "No issues available",
        issues: [],
      };
    }
    return {
      success: true,
      message: "All issues retrieved successfully",
      issues: result.rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      issues: [],
    };
  }
};
const getIssuesByIdService = async (id: string) => {
  try {
    const res = await pool.query(
      `
        SELECT * FROM issues WHERE id=$1 
        `,
      [id],
    );

    if (res.rows.length === 0) {
      return {
        success: false,
        message: "Issues not found",
      };
    }
    return {
      success: true,
      message: "Issue found",
      issue: res.rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
const updateIssueService = async (id: string, updateData: UpdateIssue) => {
  try {
    const { title, description, type, status } = updateData;
     const res = await pool.query(
      `
      UPDATE issues SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *
      `,
      [title, description, type, status, id]
    );
    if (res.rows.length === 0) {
      return {
        success: false,
        message: "Issue never found",
        data: {},
      };
    }
    return {
      sucess: true,
      message: "Issue Update successfully!!",
      issue: res.rows[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
export {
  createIssuesService,
  getAllIssuesService,
  getIssuesByIdService,
  updateIssueService,
};
