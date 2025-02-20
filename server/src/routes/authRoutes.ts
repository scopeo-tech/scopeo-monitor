import express from 'express';
import { userRegister, userLogin, userLogout, refreshingToken } from '../controller/auth/authController';
import tryCatch from '../lib/util/tryCatch';
import verifyToken  from '../middleware/verifyToken';

const authRouter = express.Router();

authRouter
.post('/register', tryCatch(userRegister))
.post('/login', tryCatch(userLogin))
.post('/logout', tryCatch(userLogout))
.post('/refresh-token', tryCatch(refreshingToken))
export default authRouter
