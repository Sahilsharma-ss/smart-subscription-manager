import { Pencil, Trash2 } from "lucide-react";
import Badge from "./Badge.jsx";

function SubscriptionTable({ items, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white/80 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-100/70 text-xs uppercase tracking-[0.14em] text-stone-500">
          <tr>
            <th className="px-5 py-3">Service</th>
            <th className="px-5 py-3">Plan</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Renewal</th>
            <th className="px-5 py-3">Price</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.subscription_id} className="border-t border-stone-100 hover:bg-stone-50/80">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-stone-100" />
                  <div>
                    <p className="font-semibold text-stone-900">{item.service_name}</p>
                    {item.possibly_unused && (
                      <p className="text-xs text-amber-600">Possibly unused</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-stone-600">{item.plan_name || "-"}</td>
              <td className="px-5 py-4">
                <Badge label={item.category_name || "General"} tone="slate" />
              </td>
              <td className="px-5 py-4 text-stone-600">{item.renewal_date}</td>
              <td className="px-5 py-4 font-semibold text-stone-900">
                {item.currency || "INR"} {Number(item.price).toLocaleString("en-IN")}
              </td>
              <td className="px-5 py-4">
                <Badge
                  label={item.status}
                  tone={item.status === "active" ? "green" : item.status === "paused" ? "amber" : "red"}
                />
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-stone-200 p-2 text-stone-600 hover:bg-stone-100"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-rose-200 p-2 text-rose-500 hover:bg-rose-50"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubscriptionTable;
