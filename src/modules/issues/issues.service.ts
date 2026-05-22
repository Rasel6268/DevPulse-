import pool from "../../config/connection/Index";
import type { IUser } from "../user/user.interface";
import type { CreateIssue } from "./createIssue.interface";
import type { UpdateIssue } from "./updateIssue.interface";

const createIssuesService = async (
  issuesData: CreateIssue,
  userData: IUser,
) => {
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
const getAllIssuesService = async (query: any) => {
  try {
    const { sort = "newest", type, status } = query;

    let baseQuery = `SELECT * FROM issues`;
    const conditions: string[] = [];
    const values: any[] = [];

    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ` + conditions.join(" AND ");
    }

    if (sort === "oldest") {
      baseQuery += ` ORDER BY created_at ASC`;
    } else {
      baseQuery += ` ORDER BY created_at DESC`;
    }

    const result = await pool.query(baseQuery, values);

    return {
      success: true,
      message:
        result.rows.length === 0
          ? "No issues available"
          : "Issues retrieved successfully",
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
      SELECT * FROM issues WHERE id = $1
      `,
      [id],
    );

    if (res.rows.length === 0) {
      return {
        success: false,
        message: "Issue not found",
      };
    }

    const issue = res.rows[0];

    const userId = issue.reporter_id;

    const userData = await pool.query(
      `
      SELECT name, email, role
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    const user = userData.rows[0];

    const singleIssue = {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: {
        id: userId,
        name: user?.name,
        email: user?.email,
        role: user?.role,
      },
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };

    return {
      success: true,
      message: "Issue found",
      issue: singleIssue,
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
      [title, description, type, status, id],
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
const deleteIssuesService = async (id: string) => {
  try {
    const res = await pool.query(
      `
        DELETE FROM issues 
        WHERE id = $1
         RETURNING *;
        `,
      [id],
    );
    if (res.rowCount === 0) {
      return {
        success: false,
        message: "Issue not found",
      };
    }
    return {
      success: true,
      message: "Issue deleted successfully",
      data: res.rows[0],
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
  deleteIssuesService,
};
