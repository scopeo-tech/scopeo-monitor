import express from "express";
import { updateProjectStatus } from "../controller/project/projectController";
import tryCatch from "../lib/util/tryCatch";
import { handleIncomingError } from "../controller/agent/errorTrack";



const packageRouter = express.Router();

packageRouter
.post("/project/status",tryCatch(updateProjectStatus))
.post("/project/errors",tryCatch(handleIncomingError))

export default packageRouter