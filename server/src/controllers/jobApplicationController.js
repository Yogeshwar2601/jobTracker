import JobApplication from "../models/jobApplication.js";

export const createApplication = async (req, res) => {
    try {
        const {
            company,
            position,
            jobType,
            location,
            applicationUrl,
            status,
            appliedDate,
            salary,
            notes,
        } = req.body;

        if (!company?.trim() || !position?.trim() || !jobType) {
            return res.status(400).json({
                success: false,
                message: "Company, position and job type are required",
            });
        }

        const application = await JobApplication.create({
            company,
            position,
            jobType,
            location,
            applicationUrl,
            status,
            appliedDate,
            salary,
            notes,
            user: req.userId,
        });

        return res.status(201).json({
            success: true,
            application,
        });
    } catch (error) {
        console.error("Create application error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create application",
        });
    }
};


export const getApplications = async (req, res) => {
    try {
        const { search, status, jobType, sort = "newest" } = req.query;

        const filter = { user: req.userId };

        const allowedStatuses = [
            "Applied",
            "Interview",
            "Offer",
            "Rejected",
            "Withdrawn",
        ];

        const allowedJobTypes = [
            "Internship",
            "Full-time",
            "Part-time",
            "Contract",
        ];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status",
            });
        }

        if (jobType && !allowedJobTypes.includes(jobType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job type",
            });
        }

        if (status) filter.status = status;
        if (jobType) filter.jobType = jobType;

        if (search?.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { company: { $regex: escapedSearch, $options: "i" } },
                { position: { $regex: escapedSearch, $options: "i" } },
                { location: { $regex: escapedSearch, $options: "i" } },
            ];
        }

        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            company: { company: 1 },
        };

        if (!sortOptions[sort]) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort option",
            });
        }

        const applications = await JobApplication.find(filter)
            .sort(sortOptions[sort]);

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error("Get applications error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
        });
    }
};


export const getApplicationById = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            application,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID",
            });
        }

        console.error("Get application error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch application",
        });
    }
};

export const updateApplication = async (req, res) => {
    try {
        const allowedFields = [
            "company",
            "position",
            "jobType",
            "location",
            "applicationUrl",
            "status",
            "appliedDate",
            "salary",
            "notes",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const application = await JobApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            application,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID or field value",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Update application error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update application",
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID",
            });
        }

        console.error("Delete application error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete application",
        });
    }
};

export const getApplicationStats = async (req, res) => {
    try {
        const userFilter = { user: req.userId };

        const [
            total,
            applied,
            interviews,
            offers,
            rejected,
            withdrawn,
        ] = await Promise.all([
            JobApplication.countDocuments(userFilter),
            JobApplication.countDocuments({
                ...userFilter,
                status: "Applied",
            }),
            JobApplication.countDocuments({
                ...userFilter,
                status: "Interview",
            }),
            JobApplication.countDocuments({
                ...userFilter,
                status: "Offer",
            }),
            JobApplication.countDocuments({
                ...userFilter,
                status: "Rejected",
            }),
            JobApplication.countDocuments({
                ...userFilter,
                status: "Withdrawn",
            }),
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                total,
                applied,
                interviews,
                offers,
                rejected,
                withdrawn,
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
        });
    }
};

