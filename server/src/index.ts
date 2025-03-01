import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRouter from "./routes/authRoutes";
import projectRouter from "./routes/projectRoute";
import userRoutes from "./routes/userRoutes";
import packageRouter from "./routes/packageRoute";
// import startFlaggingOldStatusesCronJob from "./jobs/cronJob";

dotenv.config();

const app = e();
dbConnect();
// startFlaggingOldStatusesCronJob();


app.use(
  cors({origin: process.env.CLIENT_URL,credentials: true })
);
app.use(e.json());

app.use("/api/auth",authRouter) 
app.use("/api/project",projectRouter)
app.use("/api/user",userRoutes)
app.use("/api/package",packageRouter)



app.use(globalErrorHandler);

const port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

