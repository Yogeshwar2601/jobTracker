import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "JobTrack API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", jobApplicationRoutes);

export default app;