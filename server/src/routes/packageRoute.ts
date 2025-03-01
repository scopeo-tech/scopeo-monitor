import express from "express";
import { updateProjectStatus } from "../controller/project/projectController";
import tryCatch from "../lib/util/tryCatch";
import { handleIncomingError } from "../controller/agent/errorTrack";
import { handleIncomingSecurity } from "../controller/agent/security";



const packageRouter = express.Router();

packageRouter
.post("/status",tryCatch(updateProjectStatus))
.post("/errors",tryCatch(handleIncomingError))
.post("/security",tryCatch(handleIncomingSecurity))

export default packageRouter