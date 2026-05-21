import { json } from "node:stream/consumers";
import pool from "../../config/connection/Index";
import type { IUser, loginData } from "./user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUserService = async (userData: IUser) => {
  try {
    const { name, email, password, role } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `
    INSERT INTO users (name, email, password, role)
    VALUES($1,$2,$3,$4) RETURNING id, name, email, role, created_at
    `,
      [name, email, hashedPassword, role],
    );
    return {
      success: true,
      message: "User Registered Successfully!",
      data: result.rows[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
};
const loginUserService = async (loginData: loginData) => {
  try {
    const { email, password } = loginData;
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Invalid email",
      };
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid password",
      };
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "1h" },
    );
    return {
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
};
const getAllUserService = async () => {
  try {
    const res = await pool.query(`
      SELECT id, name, email, role, created_at, updated_at FROM users
    `);
    return {
      success: true,
      message: "Users retrieved successfully",
      data: res.rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
}
export { registerUserService, loginUserService, getAllUserService };
