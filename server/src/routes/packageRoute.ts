import express from "express";
import { updateProjectStatus } from "../controller/project/projectController";
import tryCatch from "../lib/util/tryCatch";
import { handleIncomingError } from "../controller/agent/errorTrack";
import { handleIncomingSecurity } from "../controller/agent/security";
import { handleIncomingPerformance } from "../controller/agent/performance";



const packageRouter = express.Router();

packageRouter
.post("/ping",tryCatch(updateProjectStatus))
.post("/errors",tryCatch(handleIncomingError))
.post("/security",tryCatch(handleIncomingSecurity))
.post("/performance",tryCatch(handleIncomingPerformance))

export default packageRouter