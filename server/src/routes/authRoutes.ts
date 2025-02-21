import express from 'express';
import { userRegister, userLogin, userLogout, refreshingToken, sendOtpForRegister, verifyOtp } from '../controller/auth/authController';
import tryCatch from '../lib/util/tryCatch';

const authRouter = express.Router();

authRouter
.get("/register/:email", tryCatch(sendOtpForRegister))
.post("/verify-otp", tryCatch(verifyOtp)) 
.post('/register', tryCatch(userRegister))
.post('/login', tryCatch(userLogin))
.post('/logout', tryCatch(userLogout))
.post('/refresh-token', tryCatch(refreshingToken))
export default authRouter
