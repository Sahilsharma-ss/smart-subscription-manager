import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";
import SubscriptionTable from "../components/SubscriptionTable.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    document.title = "Subscriptions | Smart Subscription Manager";
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

  const filtered = useMemo(() => {
    return subscriptions.filter((item) => {
      const matchesSearch = item.service_name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const handleEdit = (item) => {
    navigate(`/subscriptions/${item.subscription_id}/edit`);
  };

  const confirmDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/subscriptions/${deleteTarget.subscription_id}`);
      setSubscriptions((prev) =>
        prev.filter((item) => item.subscription_id !== deleteTarget.subscription_id)
      );
      toast.success("Subscription deleted");
    } catch (error) {
      toast.error("Failed to delete subscription");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-200 bg-white/80 px-6 py-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900 font-display">My Subscriptions</h1>
          <p className="text-sm text-stone-500">Track everything you are paying for.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/subscriptions/new")}
          className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_-20px_rgba(13,148,136,0.6)]"
        >
          Add Subscription
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          className="w-full max-w-xs rounded-xl border border-stone-200 bg-white/80 px-4 py-2 text-sm"
          placeholder="Search by service name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-6 text-sm text-stone-500">
          Loading subscriptions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white/80 p-6 text-sm text-stone-500">
          No subscriptions yet. Add one to get started.
        </div>
      ) : (
        <SubscriptionTable items={filtered} onEdit={handleEdit} onDelete={confirmDelete} />
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete subscription"
        description="This action cannot be undone. The subscription will be removed permanently."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Subscriptions;
