import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import AlertCard from "../components/AlertCard.jsx";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    document.title = "Alerts | Smart Subscription Manager";
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/api/alerts");
      setAlerts(response.data.alerts || []);
    } catch (error) {
      toast.error("Failed to load alerts");
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put("/api/alerts/read-all");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to mark alerts read");
    }
  };

  const unreadCount = alerts.filter((alert) => alert.status === "unread").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-200 bg-white/80 px-6 py-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Signals</p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900 font-display">Renewal Alerts</h1>
          <p className="text-sm text-stone-500">{unreadCount} unread alerts</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
        >
          Mark all as read
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white/80 p-6 text-sm text-stone-500">
          You are all caught up!
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {alerts.map((alert) => (
            <AlertCard key={alert.notification_id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;
