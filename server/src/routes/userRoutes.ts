import express from 'express';
import { getUserProjectCount, getProjectList, getUserById, updateProfile, deleteProfile, checkUsername } from '../controller/user/userController';
import tryCatch from '../lib/util/tryCatch';
import verifyToken from '../middleware/verifyToken';

const userRoutes = express.Router();

userRoutes
.get('/info',verifyToken,tryCatch(getUserById))
.get('/project/count',verifyToken,tryCatch(getUserProjectCount))
.get('/list',verifyToken,tryCatch(getProjectList))
.put('/update-profile',verifyToken,tryCatch(updateProfile))
.delete('delete-profile/:userId',tryCatch(deleteProfile))
.get('/:username',tryCatch(checkUsername))

export default userRoutes;
