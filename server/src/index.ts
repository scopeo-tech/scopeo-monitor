import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRouter from "./routes/authRoutes";

const app = e();
dotenv.config();
dbConnect();
app.use(cors());
app.use(e.json());

app.use("/api/auth", authRouter);



app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
