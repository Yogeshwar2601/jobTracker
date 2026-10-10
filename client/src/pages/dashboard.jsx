import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createApplication,
    deleteApplication,
    getApplications,
    getApplicationStats,
    updateApplication,
} from "../api/applicationService";
import { getStoredUser, logoutUser } from "../api/authService";

const statuses = ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"];
const jobTypes = ["Internship", "Full-time", "Part-time", "Contract"];

const createEmptyForm = () => ({
    company: "",
    position: "",
    jobType: "Internship",
    location: "",
    applicationUrl: "",
    status: "Applied",
    appliedDate: new Date().toISOString().slice(0, 10),
    salary: "",
    notes: "",
});

const statCards = [
    { key: "total", label: "Total applications", icon: "▤", color: "text-indigo-600", bg: "bg-indigo-50" },
    { key: "applied", label: "Applied", icon: "↗", color: "text-blue-600", bg: "bg-blue-50" },
    { key: "interviews", label: "Interviews", icon: "◷", color: "text-amber-600", bg: "bg-amber-50" },
    { key: "offers", label: "Offers", icon: "✓", color: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "rejected", label: "Rejected", icon: "×", color: "text-rose-600", bg: "bg-rose-50" },
];

const statusStyles = {
    Applied: "bg-blue-50 text-blue-700 ring-blue-600/20",
    Interview: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Offer: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
    Withdrawn: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getStoredUser();

    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({});
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [jobType, setJobType] = useState("");
    const [sort, setSort] = useState("newest");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(createEmptyForm());

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [applicationData, statsData] = await Promise.all([
                getApplications({ search, status, jobType, sort }),
                getApplicationStats(),
            ]);

            setApplications(applicationData.applications || []);
            setStats(statsData || {});
        } catch (err) {
            if (err.response?.status === 401) {
                logoutUser();
                navigate("/login", { replace: true });
                return;
            }

            setError(
                err.response?.data?.message ||
                "Could not load your applications. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [search, status, jobType, sort, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadDashboard();
        }, 250);

        return () => clearTimeout(timer);
    }, [loadDashboard]);

    const resetForm = () => {
        setForm(createEmptyForm());
        setEditingId(null);
        setShowForm(false);
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login", { replace: true });
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await createApplication(form);
            resetForm();
            setSuccess("Application added successfully.");
            await loadDashboard();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not save the application."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (application) => {
        setEditingId(application._id);

        setForm({
            company: application.company || "",
            position: application.position || "",
            jobType: application.jobType || "Internship",
            location: application.location || "",
            applicationUrl: application.applicationUrl || "",
            status: application.status || "Applied",
            appliedDate: application.appliedDate
                ? new Date(application.appliedDate).toISOString().slice(0, 10)
                : "",
            salary: application.salary || "",
            notes: application.notes || "",
        });

        setShowForm(true);
        setError("");
        setSuccess("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editingId) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await updateApplication(editingId, form);
            resetForm();
            setSuccess("Application updated successfully.");
            await loadDashboard();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not update the application."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (application) => {
        const confirmed = window.confirm(
            `Delete the application for ${application.company}?`
        );

        if (!confirmed) return;

        setDeletingId(application._id);
        setError("");
        setSuccess("");

        try {
            await deleteApplication(application._id);

            if (editingId === application._id) {
                resetForm();
            }

            setSuccess("Application deleted successfully.");
            await loadDashboard();
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not delete the application."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
                            J
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight">JobTrack</h1>
                            <p className="text-xs text-slate-500">
                                Your career, organized.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name || "Job seeker"}
                            </p>
                            <p className="text-xs text-slate-500">
                                Personal dashboard
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
                            YOUR OVERVIEW
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Job applications
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Track your applications, follow your progress, and stay
                            organized throughout your job search.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setForm(createEmptyForm());
                                setEditingId(null);
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                            }
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    >
                        <span className="text-lg leading-none">
                            {showForm ? "×" : "+"}
                        </span>
                        {showForm ? "Close form" : "Add application"}
                    </button>
                </section>

                {error && (
                    <div
                        role="alert"
                        className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                    >
                        <span>{error}</span>
                        <button
                            onClick={() => setError("")}
                            className="font-semibold"
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
                    >
                        <span>{success}</span>
                        <button
                            onClick={() => setSuccess("")}
                            className="font-semibold"
                            aria-label="Dismiss success message"
                        >
                            ×
                        </button>
                    </div>
                )}

                {showForm && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold">
                                    {editingId ? "Edit application" : "Add a job application"}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {editingId
                                        ? "Update the details or current status of this opportunity."
                                        : "Record a new opportunity in your tracker."}
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={editingId ? handleUpdate : handleCreate}
                            className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <div>
                                <label htmlFor="company" className="text-sm font-medium">
                                    Company <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    value={form.company}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="e.g. Google"
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label htmlFor="position" className="text-sm font-medium">
                                    Position <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    id="position"
                                    name="position"
                                    value={form.position}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="e.g. Software Engineer Intern"
                                    required
                                    maxLength={150}
                                />
                            </div>

                            <div>
                                <label htmlFor="jobType" className="text-sm font-medium">
                                    Job type <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="jobType"
                                    name="jobType"
                                    value={form.jobType}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    required
                                >
                                    {jobTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="text-sm font-medium">
                                    Application status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                >
                                    {statuses.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="location" className="text-sm font-medium">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    value={form.location}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="Remote / City"
                                    maxLength={150}
                                />
                            </div>

                            <div>
                                <label htmlFor="appliedDate" className="text-sm font-medium">
                                    Date applied
                                </label>
                                <input
                                    id="appliedDate"
                                    name="appliedDate"
                                    type="date"
                                    value={form.appliedDate}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="applicationUrl"
                                    className="text-sm font-medium"
                                >
                                    Job posting URL
                                </label>
                                <input
                                    id="applicationUrl"
                                    name="applicationUrl"
                                    type="url"
                                    value={form.applicationUrl}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="https://example.com/job"
                                />
                            </div>

                            <div>
                                <label htmlFor="salary" className="text-sm font-medium">
                                    Salary / stipend
                                </label>
                                <input
                                    id="salary"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    placeholder="e.g. ₹25,000/month"
                                    maxLength={100}
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label htmlFor="notes" className="text-sm font-medium">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleFormChange}
                                    className={inputClass}
                                    rows={3}
                                    placeholder="Interview dates, recruiter details, follow-ups..."
                                    maxLength={2000}
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update application"
                                            : "Save application"}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={saving}
                                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {statCards.map((card) => (
                        <div
                            key={card.key}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-slate-500">
                                    {card.label}
                                </p>
                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${card.color} ${card.bg}`}
                                >
                                    {card.icon}
                                </span>
                            </div>

                            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                                {stats[card.key] ?? "—"}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                            <div>
                                <h3 className="text-lg font-bold">Your applications</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Search, filter, edit, and manage your opportunities.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <input
                                    aria-label="Search applications"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search company, role..."
                                    className="min-w-0 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                                <select
                                    aria-label="Filter by status"
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                >
                                    <option value="">All statuses</option>
                                    {statuses.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    aria-label="Filter by job type"
                                    value={jobType}
                                    onChange={(event) => setJobType(event.target.value)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                >
                                    <option value="">All job types</option>
                                    {jobTypes.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    aria-label="Sort applications"
                                    value={sort}
                                    onChange={(event) => setSort(event.target.value)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                                >
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                    <option value="company">Company A–Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-3 p-14">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                            <p className="text-sm text-slate-500">
                                Loading your applications...
                            </p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                                ▤
                            </div>

                            <h4 className="mt-4 font-semibold text-slate-900">
                                No applications found
                            </h4>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                {search || status || jobType
                                    ? "Try changing your search or filters."
                                    : "Start tracking your job search by adding your first application."}
                            </p>

                            {!search && !status && !jobType && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Add your first application
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            Company / Position
                                        </th>
                                        <th className="px-6 py-4 font-semibold">Job type</th>
                                        <th className="px-6 py-4 font-semibold">Date applied</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {applications.map((application) => (
                                        <tr
                                            key={application._id}
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-900">
                                                    {application.company}
                                                </p>
                                                <p className="mt-1 text-slate-500">
                                                    {application.position}
                                                </p>
                                                {application.location && (
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {application.location}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {application.jobType}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {application.appliedDate
                                                    ? new Date(
                                                        application.appliedDate
                                                    ).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[application.status] ||
                                                        "bg-slate-100 text-slate-600 ring-slate-500/20"
                                                        }`}
                                                >
                                                    {application.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {application.applicationUrl && (
                                                        <a
                                                            href={application.applicationUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            View job
                                                        </a>
                                                    )}

                                                    <button
                                                        onClick={() => handleEdit(application)}
                                                        className="font-medium text-slate-700 hover:text-indigo-600"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(application)}
                                                        disabled={deletingId === application._id}
                                                        className="font-medium text-rose-600 hover:text-rose-800 disabled:opacity-50"
                                                    >
                                                        {deletingId === application._id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex flex-col justify-between gap-2 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center">
                        <span>
                            Showing {applications.length} application
                            {applications.length === 1 ? "" : "s"}
                        </span>
                        <span>Changes are saved to your account.</span>
                    </div>
                </section>
            </main>
        </div>
    );
}