import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
        jobType: {
            type: String,
            enum: ["Internship", "Full-time", "Part-time", "Contract"],
            required: true,
        },
        location: {
            type: String,
            trim: true,
        },
        applicationUrl: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"],
            default: "Applied",
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        salary: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const JobApplication = mongoose.model(
    "JobApplication",
    jobApplicationSchema
);

export default JobApplication;