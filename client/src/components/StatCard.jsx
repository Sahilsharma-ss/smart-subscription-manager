function StatCard({ label, value, icon, accent = "border-indigo-500" }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white/80 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur ${accent}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{label}</p>
        <div className="rounded-full bg-stone-100 p-2 text-stone-600">{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

export default StatCard;
