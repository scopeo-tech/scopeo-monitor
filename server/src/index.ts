import e from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = e();
dotenv.config();

app.use(cors());
app.use(e.json());

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});