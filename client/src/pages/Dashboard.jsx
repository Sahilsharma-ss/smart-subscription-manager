import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CalendarClock, CreditCard, Wallet } from "lucide-react";
import api from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | Smart Subscription Manager";
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/dashboard");
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const upcoming = data?.upcomingRenewals || [];
  const surveyUnused = data?.surveyUnused || [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-gradient-to-br from-white via-white to-teal-50/70 p-6 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)]">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-900 font-display">Dashboard</h1>
        <p className="text-sm text-stone-500">
          {greeting}{user?.name ? `, ${user.name}` : ""}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          <>
            <StatCard
              label="Active Subscriptions"
              value={data?.totalActive ?? 0}
              icon={<CreditCard size={18} />}
              accent="border-l-4 border-l-teal-500"
            />
            <StatCard
              label="Monthly Spend"
              value={`${data?.currency || "INR"} ${Number(data?.monthlyTotal || 0).toLocaleString("en-IN")}`}
              icon={<Wallet size={18} />}
              accent="border-l-4 border-l-emerald-500"
            />
            <StatCard
              label="Due This Week"
              value={data?.upcomingCount ?? 0}
              icon={<CalendarCheck size={18} />}
              accent="border-l-4 border-l-amber-500"
            />
            <StatCard
              label="30-Day Exposure"
              value={`${data?.currency || "INR"} ${Number(data?.financialExposure || 0).toLocaleString("en-IN")}`}
              icon={<CalendarClock size={18} />}
              accent="border-l-4 border-l-rose-500"
            />
          </>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Upcoming Renewals</h2>
          <span className="text-xs text-stone-500">Next 7 days</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.14em] text-stone-400">
              <tr>
                <th className="py-3">Service</th>
                <th>Plan</th>
                <th>Renewal Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Days Left</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-stone-500">
                    No renewals in the next 7 days.
                  </td>
                </tr>
              ) : (
                upcoming.map((item) => (
                  <tr key={item.subscription_id} className="border-t border-stone-100">
                    <td className="py-4 font-semibold text-stone-900">{item.service_name}</td>
                    <td className="py-4 text-stone-600">{item.plan_name || "-"}</td>
                    <td className="py-4 text-stone-600">{item.renewal_date}</td>
                    <td className="py-4 text-stone-900">
                      {item.currency || "INR"} {Number(item.price).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 text-stone-600">{item.status}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                        {item.days_left} days
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Survey: Not Using</h2>
          <span className="text-xs text-stone-500">Latest responses</span>
        </div>
        {surveyUnused.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No subscriptions marked as not using yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {surveyUnused.map((item) => (
              <div
                key={item.subscription_id}
                className="rounded-2xl border border-stone-200/70 bg-white/80 p-4"
              >
                <p className="text-sm font-semibold text-stone-900">{item.service_name}</p>
                <p className="text-xs text-stone-500">{item.plan_name || "Plan"}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                  <span>Renews {item.renewal_date}</span>
                  <span>
                    {item.currency || "INR"} {Number(item.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-stone-400">
        Figures are estimates for informational purposes only.
      </p>
    </div>
  );
}

export default Dashboard;
