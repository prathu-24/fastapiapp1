import { useState, useEffect } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "../services/JobService";
import { getCompanies } from "../services/CompanyService";
import type { job } from "../types/job";
import type { company } from "../types/company";

function JobCard() {
  const [jobs, setJobs] = useState<job[]>([]);
  const [companies, setCompanies] = useState<company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CRUD state
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [addForm, setAddForm] = useState<Omit<job, "id">>({
    title: "",
    description: "",
    salary: 0,
    company_id: 0,
  });
  const [editForm, setEditForm] = useState<Partial<job>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [fetchedJobs, fetchedCompanies] = await Promise.all([
        getJobs(),
        getCompanies(),
      ]);
      setJobs(fetchedJobs);
      setCompanies(fetchedCompanies);
      // Auto-select first company in add form if available
      if (fetchedCompanies.length > 0) {
        setAddForm((prev) => ({ ...prev, company_id: fetchedCompanies[0].id }));
      }
    } catch (err: any) {
      console.error("Failed to load jobs/companies", err);
      setError(err?.message || "Failed to load jobs data");
    } finally {
      setLoading(false);
    }
  }

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.company_id) {
      alert("Please fill in Job Title and select a Company");
      return;
    }
    try {
      await createJob(addForm);
      setAddForm({
        title: "",
        description: "",
        salary: 0,
        company_id: companies[0]?.id || 0,
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to create job", err);
      alert("Failed to add job. Ensure you have Admin or HR permissions.");
    }
  };

  const handleUpdateJob = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    try {
      await updateJob(id, editForm);
      setEditJobId(null);
      await fetchData();
    } catch (err) {
      console.error("Failed to update job", err);
      alert("Failed to update job. Ensure you have Admin or HR permissions.");
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job. Ensure you have Admin or HR permissions.");
    }
  };

  const startEdit = (j: job) => {
    setEditJobId(j.id);
    setEditForm({
      title: j.title,
      description: j.description,
      salary: j.salary,
      company_id: j.company_id,
    });
  };

  const getCompanyName = (companyId: number) => {
    const comp = companies.find((c) => c.id === companyId);
    return comp ? comp.name : `Company (ID: ${companyId})`;
  };

  if (loading) {
    return (
      <section className="job-card-section">
        <p style={{ textAlign: "center", color: "#6b7280" }}>Loading opportunities...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="job-card-section">
        <p style={{ textAlign: "center", color: "#dc2626" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="job-card-section">
      <div className="section-header">
        <h2>Featured Opportunities</h2>
      </div>

      <div className="companies-grid">
        {jobs.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#6b7280" }}>
            No opportunities listed yet. Add one below!
          </p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job.id}>
              {editJobId === job.id ? (
                <form className="edit-mode" onSubmit={(e) => handleUpdateJob(e, job.id)}>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Job Title"
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1.5px solid #e2e5ee",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#1f2937",
                      marginBottom: "8px"
                    }}
                  />
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Job Description"
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1.5px solid #e2e5ee",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#1f2937",
                      marginBottom: "8px",
                      resize: "vertical"
                    }}
                  />
                  <input
                    type="number"
                    value={editForm.salary || 0}
                    onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                    placeholder="Salary (LPA)"
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      marginBottom: "8px"
                    }}
                  />
                  <select
                    value={editForm.company_id || 0}
                    onChange={(e) => setEditForm({ ...editForm, company_id: Number(e.target.value) })}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1.5px solid #e2e5ee",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      color: "#1f2937",
                      marginBottom: "12px",
                      outline: "none"
                    }}
                  >
                    <option value={0} disabled>Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id} style={{ backgroundColor: "#fff", color: "#1f2937" }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="edit-actions">
                    <button className="btn btn-primary btn-sm" type="submit">
                      ✓ Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      type="button"
                      onClick={() => setEditJobId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1>{job.title}</h1>
                  <div className="info-row">
                    <span className="info-icon">🏢</span>
                    <span>{getCompanyName(job.company_id)}</span>
                  </div>
                  {job.description && (
                    <p className="job-description" style={{ fontSize: "14px", color: "#6b7280", margin: "8px 0" }}>
                      {job.description}
                    </p>
                  )}
                  <div className="job-meta">
                    <span className="job-tag">💰 {job.salary} LPA</span>
                    <span className="job-tag">🕐 Full-time</span>
                    <span className="job-tag">🌿 Remote</span>
                  </div>
                  <div className="company-card-actions" style={{ marginTop: "16px" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => startEdit(job)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add New Job Section */}
      <div className="add-company-section" style={{ marginTop: "40px" }}>
        <h2>Post a New Opportunity</h2>
        <form onSubmit={handleAddJob}>
          <div className="form-grid">
            <div className="input-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Salary (LPA)</label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={addForm.salary || ""}
                onChange={(e) => setAddForm({ ...addForm, salary: Number(e.target.value) })}
                required
              />
            </div>
            <div className="input-group" style={{ gridColumn: "span 2" }}>
              <label>Company</label>
              <select
                value={addForm.company_id}
                onChange={(e) => setAddForm({ ...addForm, company_id: Number(e.target.value) })}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e5ee",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#1f2937",
                  outline: "none",
                }}
              >
                <option value={0} disabled>Select Partner Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: "#fff", color: "#1f2937" }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: "span 2" }}>
              <label>Job Description</label>
              <textarea
                placeholder="Write key requirements and duties..."
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e5ee",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#1f2937",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: "16px" }}>
            🌿 Post Job
          </button>
        </form>
      </div>
    </section>
  );
}

export default JobCard;