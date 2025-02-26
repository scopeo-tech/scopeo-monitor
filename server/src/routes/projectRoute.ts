import express from "express";
import { checkProjectName, createProject ,getApiKey, getPassKey, getProjectPassKey,updateProject,deleteProject} from "../controller/project/projectController";
import verifyToken from "../middleware/verifyToken";
import tryCatch from "../lib/util/tryCatch";


const router = express.Router();


router.use(verifyToken);

router

.post("/create-project", tryCatch(createProject))
.get("/api-key", tryCatch(getApiKey))
.get("/pass-key", tryCatch(getPassKey))
.get("/get-project-passkey/:projectId",tryCatch(getProjectPassKey))
.put("/update-project/:projectId",tryCatch(updateProject))
.post("/check-project-name",tryCatch(checkProjectName))
.delete("/delete-project/:projectId",tryCatch(deleteProject))

export default router