import express from "express";
import { updateProjectStatus } from "../controller/project/projectController";
import tryCatch from "../lib/util/tryCatch";
import { handleIncomingError } from "../controller/agent/errorTrack";



const packageRouter = express.Router();

packageRouter
.post("/status",tryCatch(updateProjectStatus))
.post("/errors",tryCatch(handleIncomingError))

export default packageRouter