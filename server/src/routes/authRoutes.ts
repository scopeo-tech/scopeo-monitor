import express from 'express';
import { userRegister, userLogin } from '../controller/auth/authController';
import tryCatch from '../lib/util/tryCatch';

const authRouter = express.Router();

authRouter
.post('/register', tryCatch(userRegister))
.post('/login', tryCatch(userLogin))

export default authRouter
