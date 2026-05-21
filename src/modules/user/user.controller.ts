import type { Request, Response } from "express";
import { registerUserService } from "./user.service";

const registerUserController = async (req: Request, res: Response) => {
   try {
      const result = await registerUserService(req.body);
      if (result.success) {
         res.status(201).json(result);
      } else {
         res.status(400).json(result);
      }
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error registering user",
         error: error instanceof Error ? error.message : "Unknown error"
      });
   }
}

export { registerUserController };