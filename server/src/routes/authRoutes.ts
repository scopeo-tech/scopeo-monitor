import express from 'express';
import { userRegister, userLogin, userLogout, refreshingToken, sendOtpForRegister, verifyOtp, googleLogin } from '../controller/auth/authController';
import tryCatch from '../lib/util/tryCatch';

const authRouter = express.Router();

authRouter
.get("/register/:email", tryCatch(sendOtpForRegister))
.post("/verify-otp", tryCatch(verifyOtp)) 
.post('/register', tryCatch(userRegister))
.post('/login', tryCatch(userLogin))
.post("/google-login", tryCatch(googleLogin))
.post('/logout', tryCatch(userLogout))
.post('/refresh-token', tryCatch(refreshingToken))
export default authRouter
