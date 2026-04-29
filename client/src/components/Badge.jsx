const toneStyles = {
  indigo: "bg-teal-100 text-teal-800",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-stone-100 text-stone-700",
};

function Badge({ label, tone = "slate" }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {label}
    </span>
  );
}

export default Badge;
