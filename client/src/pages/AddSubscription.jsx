import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";

const defaultForm = {
  serviceId: "",
  planId: "",
  categoryId: "",
  billingCycle: "monthly",
  startDate: "",
  renewalDate: "",
  price: "",
  currency: "INR",
  status: "active",
  autoRenew: true,
  importanceLevel: "medium",
  notes: "",
};

function AddSubscription() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [services, setServices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    document.title = "Add Subscription | Smart Subscription Manager";
  }, []);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await api.get("/api/metadata");
        setServices(response.data.services || []);
        setPlans(response.data.plans || []);
        setCategories(response.data.categories || []);
      } catch (error) {
        toast.error("Failed to load metadata");
      }
    };

    fetchMeta();
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => String(plan.service_id) === String(form.serviceId));
  }, [plans, form.serviceId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.serviceId || !form.planId || !form.categoryId || !form.renewalDate || !form.price) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      await api.post("/api/subscriptions", {
        ...form,
        serviceId: Number(form.serviceId),
        planId: Number(form.planId),
        categoryId: Number(form.categoryId),
        price: Number(form.price),
      });
      toast.success("Subscription created");
      navigate("/subscriptions");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save subscription");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add Subscription</h1>
        <p className="text-sm text-slate-500">Create a new subscription profile.</p>
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
            <option value="">Select service</option>
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
            <option value="">Select plan</option>
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
            <option value="">Select category</option>
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
            value={form.startDate}
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
            Save Subscription
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSubscription;
