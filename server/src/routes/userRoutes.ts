import express from 'express';
import { getUserProjectCount, getProjectList, getUserById, updateProfile, deleteProfile, checkUsername ,getProjectById,contactUs} from '../controller/user/userController';
import tryCatch from '../lib/util/tryCatch';
import verifyToken from '../middleware/verifyToken';
import cacheMiddleware from '../middleware/redisCache';

const userRoutes = express.Router();

userRoutes
.get('/info',verifyToken,cacheMiddleware,tryCatch(getUserById))
.get('/project/count',verifyToken,cacheMiddleware,tryCatch(getUserProjectCount))
.get('/list',verifyToken,cacheMiddleware,tryCatch(getProjectList))
.get("/project/:projectId",verifyToken,cacheMiddleware,tryCatch(getProjectById))
.get('/check/:username',verifyToken,cacheMiddleware,tryCatch(checkUsername))
.post('/contact',verifyToken,tryCatch(contactUs))
.put('/update-profile',verifyToken,tryCatch(updateProfile))
.delete('/delete-profile/:userId',verifyToken,tryCatch(deleteProfile))

export default userRoutes;
