import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";

function Survey() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Usage Survey | Smart Subscription Manager";
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/subscriptions");
        setSubscriptions(response.data.subscriptions || []);
      } catch (error) {
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleChange = (subscriptionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [subscriptionId]: value,
    }));
  };

  const canSubmit = useMemo(() => {
    return subscriptions.length > 0 && Object.keys(responses).length > 0;
  }, [subscriptions.length, responses]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error("Select at least one response");
      return;
    }

    const payload = Object.entries(responses).map(([id, status]) => ({
      subscriptionId: Number(id),
      status,
    }));

    try {
      setSubmitting(true);
      await api.post("/api/usage/survey", { responses: payload });
      toast.success("Survey submitted. Thanks!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit survey");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white/80 px-6 py-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Pulse Check</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 font-display">Usage Survey</h1>
        <p className="text-sm text-stone-500">
          Tell us which subscriptions you are actively using to get better cost-cutting tips.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-6 text-sm text-stone-500">
          Loading subscriptions...
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white/80 p-6 text-sm text-stone-500">
          No subscriptions found.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-stone-200 bg-white/80 p-6 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur"
        >
          {subscriptions.map((item) => (
            <div
              key={item.subscription_id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200/60 bg-white/70 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-stone-900">{item.service_name}</p>
                <p className="text-xs text-stone-500">{item.plan_name || "Plan"}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-stone-600">
                  <input
                    type="radio"
                    name={`usage-${item.subscription_id}`}
                    value="using"
                    checked={responses[item.subscription_id] === "using"}
                    onChange={(event) => handleChange(item.subscription_id, event.target.value)}
                  />
                  Using
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-600">
                  <input
                    type="radio"
                    name={`usage-${item.subscription_id}`}
                    value="not_using"
                    checked={responses[item.subscription_id] === "not_using"}
                    onChange={(event) => handleChange(item.subscription_id, event.target.value)}
                  />
                  Not using
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_-20px_rgba(13,148,136,0.6)] disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit survey"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Survey;
