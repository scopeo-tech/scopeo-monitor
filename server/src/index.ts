import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRouter from "./routes/authRoutes";
import projectRouter from "./routes/projectRoute";
import userRoutes from "./routes/userRoutes";
import packageRouter from "./routes/packageRoute";
import { flagOldStatusesJob, startUptimeCron } from "./jobs/cronJob";
import faqRouter from "./routes/faqRoutes";
import { app, server } from "./socket";

dotenv.config();

dbConnect();
flagOldStatusesJob();
startUptimeCron();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);
app.use("/api/user", userRoutes);
app.use("/api/package", packageRouter);
app.use("/api/faq", faqRouter);

app.use(globalErrorHandler);

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
