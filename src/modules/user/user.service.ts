import pool from "../../config/connection/Index";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const registerUserService = async (userData: IUser) => {
  try {
    const { name, email, password, role } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(password,salt)
    
  const result = await pool.query(`
    INSERT INTO users (name, email, password, role)
    VALUES($1,$2,$3,$4) RETURNING id, name, email, role, created_at
    `,[name,email,hashedPassword,role])
      return {
        success: true,
        message: "User Registered Successfully!",
        data: result.rows[0]
      }
  } catch (error : any) {
    return {
        success: false,
        message: error.message,
        error:   error
    }
  }
  
};
export { registerUserService };