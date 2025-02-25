import express from "express";
import { createProject ,getApiKey, getPassKey, getProjectPassKey} from "../controller/project/projectController";
import verifyToken from "../middleware/verifyToken";
import tryCatch from "../lib/util/tryCatch";


const router = express.Router();


router.use(verifyToken);

router

.post("/create-project", tryCatch(createProject))
.get("/api-key", tryCatch(getApiKey))
.get("/pass-key", tryCatch(getPassKey))
.get("/get-project-passkey/:projectId",tryCatch(getProjectPassKey))

export default router