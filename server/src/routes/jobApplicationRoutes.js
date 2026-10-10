import express from "express";
import {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
    getApplicationStats,
} from "../controllers/jobApplicationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getApplicationStats);

router.route("/")
    .post(createApplication)
    .get(getApplications);

router.route("/:id")
    .get(getApplicationById)
    .put(updateApplication)
    .delete(deleteApplication);

export default router;