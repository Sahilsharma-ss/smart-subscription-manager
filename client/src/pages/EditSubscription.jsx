import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";

function EditSubscription() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [services, setServices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    document.title = "Edit Subscription | Smart Subscription Manager";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metaRes, subRes] = await Promise.all([
          api.get("/api/metadata"),
          api.get(`/api/subscriptions/${id}`),
        ]);

        setServices(metaRes.data.services || []);
        setPlans(metaRes.data.plans || []);
        setCategories(metaRes.data.categories || []);

        const sub = subRes.data.subscription;
        setForm({
          serviceId: sub.service_id,
          planId: sub.plan_id,
          categoryId: sub.category_id,
          billingCycle: sub.billing_cycle,
          startDate: sub.start_date || "",
          renewalDate: sub.renewal_date,
          price: sub.price,
          currency: sub.currency || "INR",
          status: sub.status,
          autoRenew: sub.auto_renew,
          importanceLevel: sub.importance_level || "medium",
          notes: sub.notes || "",
        });
      } catch (error) {
        toast.error("Failed to load subscription");
      }
    };

    fetchData();
  }, [id]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => String(plan.service_id) === String(form?.serviceId));
  }, [plans, form?.serviceId]);

  if (!form) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading subscription...
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.put(`/api/subscriptions/${id}`, {
        ...form,
        serviceId: Number(form.serviceId),
        planId: Number(form.planId),
        categoryId: Number(form.categoryId),
        price: Number(form.price),
      });
      toast.success("Subscription updated");
      navigate("/subscriptions");
    } catch (error) {
      toast.error("Failed to update subscription");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Subscription</h1>
        <p className="text-sm text-slate-500">Update your subscription details.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-600">Service</label>
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          >
            {services.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Plan</label>
          <select
            name="planId"
            value={form.planId}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          >
            {filteredPlans.map((plan) => (
              <option key={plan.plan_id} value={plan.plan_id}>
                {plan.plan_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Billing Cycle</label>
          <select
            name="billingCycle"
            value={form.billingCycle}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Start Date</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate || ""}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Renewal Date</label>
          <input
            name="renewalDate"
            type="date"
            value={form.renewalDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Importance</label>
          <select
            name="importanceLevel"
            value={form.importanceLevel}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            name="autoRenew"
            type="checkbox"
            checked={form.autoRenew}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-indigo-500"
          />
          <span className="text-sm text-slate-600">Auto renew</span>
        </div>

        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
          />
        </div>

        <div className="lg:col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/subscriptions")}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Update Subscription
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSubscription;
