import Badge from "./Badge.jsx";

function AlertCard({ alert }) {
  const daysLeft = alert.days_left;
  const tone = daysLeft <= 1 ? "red" : daysLeft <= 3 ? "amber" : "green";

  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur ${
        alert.status === "unread" ? "border-l-4 border-l-teal-500" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-900">{alert.service_name}</p>
          <p className="text-xs text-stone-500">{alert.category_name}</p>
        </div>
        <Badge label={`${daysLeft} days`} tone={tone} />
      </div>
      <p className="mt-3 text-sm text-stone-600">{alert.message}</p>
      <p className="mt-2 text-xs text-stone-400">Renews on {alert.renewal_date}</p>
    </div>
  );
}

export default AlertCard;
