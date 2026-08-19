/**
 * CloudOpsAI - Create Service Modal
 */

import React, { useState } from "react";
import { Plus, Server, CheckCircle2 } from "lucide-react";
import { Modal } from "../common/Modal.jsx";
import { Button } from "../common/Button.jsx";
import { createService } from "../../api/services.js";
import { useToast } from "../../context/ToastContext.jsx";

export function CreateServiceModal({ isOpen, onClose, onServiceCreated }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    environment: "production",
    owner: "",
    health_status: "HEALTHY",
    description: "",
    cluster: "k8s-prod-us-east-1",
    version: "v1.0.0",
    endpoint: "",
    replicas: "3/3",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Service name is required.");
      return;
    }
    if (!formData.owner.trim()) {
      setError("Service owner / team is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await createService(formData);
      addToast({
        type: "success",
        title: "Service Registered",
        message: `${created.name} successfully added to the CloudOps registry.`,
      });
      if (onServiceCreated) onServiceCreated(created);
      onClose();
      // Reset form
      setFormData({
        name: "",
        environment: "production",
        owner: "",
        health_status: "HEALTHY",
        description: "",
        cluster: "k8s-prod-us-east-1",
        version: "v1.0.0",
        endpoint: "",
        replicas: "3/3",
      });
    } catch (err) {
      setError(err.message || "Failed to create service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Microservice"
      subtitle="Add an infrastructure workload to the CloudOpsAI monitoring mesh"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. checkout-pipeline"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Environment *
            </label>
            <select
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Owner / Team *
            </label>
            <input
              type="text"
              name="owner"
              placeholder="e.g. FinTech Platform SRE"
              value={formData.owner}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Cluster / Namespace
            </label>
            <input
              type="text"
              name="cluster"
              placeholder="e.g. k8s-prod-us-east-1"
              value={formData.cluster}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Service Description
          </label>
          <textarea
            name="description"
            rows="2"
            placeholder="Brief description of microservice functionality..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Health
            </label>
            <select
              name="health_status"
              value={formData.health_status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="HEALTHY">Healthy</option>
              <option value="DEGRADED">Degraded</option>
              <option value="DOWN">Down</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Version Tag
            </label>
            <input
              type="text"
              name="version"
              placeholder="v1.0.0"
              value={formData.version}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Replicas
            </label>
            <input
              type="text"
              name="replicas"
              placeholder="3/3"
              value={formData.replicas}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-750 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            icon={Plus}
          >
            Register Service
          </Button>
        </div>
      </form>
    </Modal>
  );
}
