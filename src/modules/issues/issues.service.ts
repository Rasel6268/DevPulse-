import pool from "../../config/connection/Index";
import type { IUser } from "../user/user.interface";
import type { Issues } from "./issues.interface";

const createIssuesService = async (issuesData: Issues, userData: IUser) => {
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

export { createIssuesService, getAllIssuesService };
