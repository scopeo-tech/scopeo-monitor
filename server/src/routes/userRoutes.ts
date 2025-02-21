import express from 'express';
import { getUserById } from '../controller/user/userController';
import tryCatch from '../lib/util/tryCatch';
import verifyToken from '../middleware/verifyToken';

const userRoutes = express.Router();

userRoutes
.get('/',verifyToken,tryCatch(getUserById))

export default userRoutes;