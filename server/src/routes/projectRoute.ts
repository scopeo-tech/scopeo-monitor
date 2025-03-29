import express from "express";
import { createProject ,getApiKey, getPassKey} from "../controller/project/projectController";
import verifyToken from "../middleware/verifyToken";
import tryCatch from "../lib/util/tryCatch";


const router = express.Router();


router.use(verifyToken);

router

.post("/create-project", tryCatch(createProject))
.get("/api-key", tryCatch(getApiKey))
.get("/pass-key", tryCatch(getPassKey));

export default router