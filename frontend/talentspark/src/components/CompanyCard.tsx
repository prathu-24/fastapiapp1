import type { company } from "../types/company";
import { useState } from "react";

type Props = {
  companies: company[];
  onedit: (company: company) => void;
  ondelete: (id: number) => void;
  onadd: (company: company) => void;
};

function CompanyCard({ companies, onadd, onedit, ondelete }: Props) {
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [editform, setEditform] = useState<company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });
  const [addform, setAddform] = useState<company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const handleAdd = () => {
    onadd(addform);
    setAddform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleEdit = () => {
    onedit(editform);
    setEditCompanyId(null);
  };

  const handleDelete = (id: number) => {
    ondelete(id);
  };

  const startEdit = (company: company) => {
    setEditCompanyId(company.id);
    setEditform({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      location: company.location,
      jobs: company.jobs,
    });
  };

  return (
    <section className="companies-section">
      <div className="section-header">
        <h2>Partner Companies</h2>
      </div>

      <div className="companies-grid">
        {companies.map((company) => (
          <div className="company-card" key={company.id}>
            {editCompanyId === company.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editform.name}
                  onChange={(e) =>
                    setEditform({ ...editform, name: e.target.value })
                  }
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  value={editform.email}
                  onChange={(e) =>
                    setEditform({ ...editform, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editform.phone}
                  onChange={(e) =>
                    setEditform({ ...editform, phone: e.target.value })
                  }
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={editform.location}
                  onChange={(e) =>
                    setEditform({ ...editform, location: e.target.value })
                  }
                  placeholder="Location"
                />
                <div className="edit-actions">
                  <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                    ✓ Save
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditCompanyId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1>{company.name}</h1>
                <div className="info-row">
                  <span className="info-icon">📧</span>
                  <span>{company.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">📱</span>
                  <span>{company.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">📍</span>
                  <span>{company.location}</span>
                </div>
                <div className="company-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => startEdit(company)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(company.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Company */}
      <div className="add-company-section">
        <h2>Add New Company</h2>
        <div className="form-grid">
          <div className="input-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="e.g. TechCorp"
              value={addform.name}
              onChange={(e) => setAddform({ ...addform, name: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="e.g. hr@techcorp.com"
              value={addform.email}
              onChange={(e) => setAddform({ ...addform, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={addform.phone}
              onChange={(e) => setAddform({ ...addform, phone: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, India"
              value={addform.location}
              onChange={(e) =>
                setAddform({ ...addform, location: e.target.value })
              }
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          🌱 Add Company
        </button>
      </div>
    </section>
  );
}

export default CompanyCard;