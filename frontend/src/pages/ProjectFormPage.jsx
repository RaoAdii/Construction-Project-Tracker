import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api.js";

const defaultForm = {
  constructionType: "building",
  status: "unknown",
  consultant: "",
  employer: "",
  fullName: "",
  shortName: "",
  description: "",
  contractAmount: "",
  signingDate: "",
  siteHandover: "",
  commencementDate: "",
  period: "",
  materials: {
    cement: "",
    bricks: "",
    steelBars: "",
    other: "",
  },
};

export default function ProjectFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [consultants, setConsultants] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/consultants").then((response) => {
      const nextConsultants = response.data.consultants;
      setConsultants(nextConsultants);

      if (!isEditing && nextConsultants[0]) {
        setForm((current) => ({ ...current, consultant: nextConsultants[0]._id }));
      }
    });
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    api.get(`/projects/${id}`).then((response) => {
      const project = response.data.project;
      setForm({
        constructionType: project.constructionType,
        status: project.status,
        consultant: project.consultant?._id || project.consultant,
        employer: project.employer,
        fullName: project.fullName,
        shortName: project.shortName,
        description: project.description || "",
        contractAmount: project.contractAmount,
        signingDate: project.signingDate?.slice(0, 10) || "",
        siteHandover: project.siteHandover?.slice(0, 10) || "",
        commencementDate: project.commencementDate?.slice(0, 10) || "",
        period: project.period,
        materials: {
          cement: project.materials?.cement?.toString() ?? "",
          bricks: project.materials?.bricks?.toString() ?? "",
          steelBars: project.materials?.steelBars?.toString() ?? "",
          other: project.materials?.other?.toString() ?? "",
        },
      });
    });
  }, [id, isEditing]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }
  function setMaterialField(field, value) {
    setForm((current) => ({
      ...current,
      materials: {
        ...current.materials,
        [field]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...form,
      contractAmount: Number(form.contractAmount),
      period: Number(form.period),
      signingDate: form.signingDate || null,
      siteHandover: form.siteHandover || null,
      materials: {
        cement: Number(form.materials.cement || 0),
        bricks: Number(form.materials.bricks || 0),
        steelBars: Number(form.materials.steelBars || 0),
        other: Number(form.materials.other || 0),
      },
    };

    try {
      if (isEditing) {
        await api.put(`/projects/${id}`, payload);
        navigate(`/projects/${id}`);
      } else {
        const response = await api.post("/projects", payload);
        navigate(`/projects/${response.data.project.id}`);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{isEditing ? "Edit project" : "Create project"}</h2>
      </div>

      <form className="project-form" onSubmit={handleSubmit}>
        <label>
          Construction type
          <select
            value={form.constructionType}
            onChange={(event) => setField("constructionType", event.target.value)}
          >
            <option value="building">Building</option>
            <option value="road">Road</option>
            <option value="water">Water</option>
          </select>
        </label>

        <label>
          Status
          <select
            value={form.status}
            onChange={(event) => setField("status", event.target.value)}
          >
            <option value="unknown">Unknown</option>
            <option value="mobilization">Mobilization</option>
            <option value="active">Active</option>
            <option value="rectification">Rectification</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        <label>
          Consultant
          <select
            value={form.consultant}
            onChange={(event) => setField("consultant", event.target.value)}
            required
          >
            {consultants.map((consultant) => (
              <option key={consultant._id} value={consultant._id}>
                {consultant.shortName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Employer
          <input
            value={form.employer}
            onChange={(event) => setField("employer", event.target.value)}
            required
          />
        </label>

        <label>
          Official project title
          <input
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            required
          />
        </label>

        <label>
          Short name
          <input
            value={form.shortName}
            onChange={(event) => setField("shortName", event.target.value)}
            required
          />
        </label>

        <label className="field-span-2">
          Description
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
          />
        </label>


        <label>
          Cement (bags)
          <input
            type="number"
            min="0"
            value={form.materials.cement}
            onChange={(event) => setMaterialField("cement", event.target.value)}
            required
          />
        </label>

        <label>
          Bricks (units)
          <input
            type="number"
            min="0"
            value={form.materials.bricks}
            onChange={(event) => setMaterialField("bricks", event.target.value)}
            required
          />
        </label>


        <label>
          Steel bars (units)
          <input
            type="number"
            min="0"
            value={form.materials.steelBars}
            onChange={(event) => setMaterialField("steelBars", event.target.value)}
            required
          />
        </label>

        <label>
          Other materials (units)
          <input
            type="number"
            min="0"
            value={form.materials.other}
            onChange={(event) => setMaterialField("other", event.target.value)}
            required
          />
        </label>

        <label>
          Contract amount
          <input
            type="number"
            min="0"
            value={form.contractAmount}
            onChange={(event) => setField("contractAmount", event.target.value)}
            required
          />
        </label>

        <label>
          Signing date
          <input
            type="date"
            value={form.signingDate}
            onChange={(event) => setField("signingDate", event.target.value)}
          />
        </label>

        <label>
          Site handover
          <input
            type="date"
            value={form.siteHandover}
            onChange={(event) => setField("siteHandover", event.target.value)}
          />
        </label>

        <label>
          Commencement date
          <input
            type="date"
            value={form.commencementDate}
            onChange={(event) => setField("commencementDate", event.target.value)}
            required
          />
        </label>

        <label>
          Contract period (days)
          <input
            type="number"
            min="1"
            value={form.period}
            onChange={(event) => setField("period", event.target.value)}
            required
          />
        </label>

        {error ? <p className="form-error field-span-2">{error}</p> : null}

        <div className="field-span-2 actions-row">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Update project" : "Create project"}
          </button>
        </div>
      </form>
    </section>
  );
}
