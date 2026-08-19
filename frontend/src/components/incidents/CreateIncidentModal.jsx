/**
 * CloudOpsAI - Create Incident Declaration Modal
 */

import React, { useState } from "react";
import { AlertOctagon, Plus, ShieldAlert } from "lucide-react";
import { Modal } from "../common/Modal.jsx";
import { Button } from "../common/Button.jsx";
import { createIncident } from "../../api/incidents.js";
import { useToast } from "../../context/ToastContext.jsx";

export function CreateIncidentModal({
  isOpen,
  onClose,
  onIncidentCreated,
  services = [],
}) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    service_id: services[0]?.id || "srv-payment",
    service_name: services[0]?.name || "payment-gateway",
    severity: "HIGH",
    status: "OPEN",
    description: "",
    commander: "Alex Mercer (Lead SRE)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "service_name") {
      const matched = services.find((s) => s.name === value);
      setFormData((prev) => ({
        ...prev,
        service_name: value,
        service_id: matched ? matched.id : "srv-custom",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Incident title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Incident summary description is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await createIncident(formData);
      addToast({
        type: "success",
        title: "Incident Declared",
        message: `${created.id} declared. War-room initialized.`,
      });
      if (onIncidentCreated) onIncidentCreated(created);
      onClose();
      setFormData({
        title: "",
        service_id: services[0]?.id || "srv-payment",
        service_name: services[0]?.name || "payment-gateway",
        severity: "HIGH",
        status: "OPEN",
        description: "",
        commander: "Alex Mercer (Lead SRE)",
      });
    } catch (err) {
      setError(err.message || "Failed to declare incident.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Declare SRE Incident & Open War-Room"
      subtitle="Trigger high-priority incident lifecycle, alerts, and AI correlation"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Incident Title *
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Spike in 504 Gateway Timeouts during checkout surge"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Affected Microservice *
            </label>
            <select
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.environment})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Severity Level *
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="CRITICAL">CRITICAL (Sev-1: Revenue impacting)</option>
              <option value="HIGH">HIGH (Sev-2: Major degraded SLA)</option>
              <option value="MEDIUM">MEDIUM (Sev-3: Partial impact)</option>
              <option value="LOW">LOW (Sev-4: Minor anomaly)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Incident Commander
            </label>
            <input
              type="text"
              name="commander"
              value={formData.commander}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="MITIGATING">MITIGATING</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Summary Description & Symptoms *
          </label>
          <textarea
            name="description"
            rows="3"
            placeholder="Describe initial symptoms, observed metrics breaches, customer reports, or log traces..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="sm"
            isLoading={isSubmitting}
            icon={AlertOctagon}
          >
            Open War-Room
          </Button>
        </div>
      </form>
    </Modal>
  );
}
