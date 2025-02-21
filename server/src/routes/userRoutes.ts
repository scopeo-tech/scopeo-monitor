import express from 'express';
import { getUserById } from '../controller/user/userController';
import tryCatch from '../lib/util/tryCatch';

const userRoutes = express.Router();

userRoutes
.get('/',tryCatch(getUserById))

export default userRoutes;