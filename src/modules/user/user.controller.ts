import type { Request, Response } from "express";
import { loginUserService, registerUserService } from "./user.service";
import { log } from "node:console";

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
const loginUserController = async (req: Request,res: Response) => {
   try {
      const result = await loginUserService(req.body);
      if(result.success){
         res.status(200).json(result);
      }else{
         res.status(400).json(result);
      }
   } catch (error: any) {
      res.status(500).json({
         success: false,
         message: error.message,
         error: error
      });
   }

}

export { registerUserController,loginUserController};