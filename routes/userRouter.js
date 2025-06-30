import express from "express";
import { blockUser, changePassword, changePasswordWithOld, getAllUsers, getCurrentUser, googleLogin, loginUser, saveUser, sendOTP, updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/",saveUser)
userRouter.post("/login",loginUser)
userRouter.post("/google",googleLogin)
userRouter.get("/current",getCurrentUser)
userRouter.post("/sendMail",sendOTP)
userRouter.post("/changePw",changePassword)
userRouter.get("/all", getAllUsers); 
userRouter.patch("/block", blockUser); 
userRouter.put("/update", updateProfile);
userRouter.put("/change-password", changePasswordWithOld);

export default userRouter;

