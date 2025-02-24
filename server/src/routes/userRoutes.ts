import express from 'express';
import { getUserProjectCount, getProjectList, getProjectList, getUserById } from '../controller/user/userController';
import tryCatch from '../lib/util/tryCatch';
import verifyToken from '../middleware/verifyToken';

const userRoutes = express.Router();

userRoutes
.get('/info',verifyToken,tryCatch(getUserById))
.get('/list',verifyToken,tryCatch(getProjectList))
.get('/project/count',verifyToken,tryCatch(getUserProjectCount))
.get('/list',verifyToken,tryCatch(getProjectList))

export default userRoutes;
