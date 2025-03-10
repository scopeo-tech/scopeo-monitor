import express from "express";
import { checkProjectName, createProject ,getApiKey, getPassKey, getProjectPassKey,updateProject,deleteProject} from "../controller/project/projectController";
import verifyToken from "../middleware/verifyToken";
import tryCatch from "../lib/util/tryCatch";
import {getBruteForceAttempts,getFailedLogins,getTotalLogins,getUnusualLogins,getSecurityStats} from "../controller/agent/security"
import { getErrorStats, getCommonError, getErrorMethodPercentages, getLatestError, getAllErrors } from "../controller/agent/errorTrack";
import { getLatestPerformance } from "../controller/agent/performance";



const router = express.Router();


router.use(verifyToken);

router

.post("/create-project", tryCatch(createProject))
.get("/api-key", tryCatch(getApiKey))
.get("/pass-key", tryCatch(getPassKey))
.get("/get-project-passkey/:projectId",tryCatch(getProjectPassKey))
.put("/update-project/:projectId",tryCatch(updateProject))
.get("/check-project-name/:name",tryCatch(checkProjectName))
.delete("/delete-project/:projectId",tryCatch(deleteProject))

//Error Stats
.get("/get-error-stats/:projectId",tryCatch(getErrorStats))
.get("/get-error-common/:projectId",tryCatch(getCommonError))
.get("/get-error-latest/:projectId",tryCatch(getLatestError))
.get("/get-error-method/:projectId",tryCatch(getErrorMethodPercentages))
.get("/get-all-errors/:projectId",tryCatch(getAllErrors))
//Security Stats
.get("/get-brute-force/:projectId",tryCatch(getBruteForceAttempts))
.get("/get-failed-logins/:projectId",tryCatch(getFailedLogins))
.get("/get-total-logins/:projectId",tryCatch(getTotalLogins))
.get("/get-unusual-logins/:projectId",tryCatch(getUnusualLogins))
.get("/get-security-stats/:projectId",tryCatch(getSecurityStats))
//Performance Stats
.get("/get-performance-latest/:projectId",tryCatch(getLatestPerformance))


export default router