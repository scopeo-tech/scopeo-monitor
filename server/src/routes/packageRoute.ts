import express from "express";
import { updateProjectStatus } from "../controller/project/projectController";
import tryCatch from "../lib/util/tryCatch";



const packageRouter = express.Router();

packageRouter
.post("/status",tryCatch(updateProjectStatus))

export default packageRouter