function ConfirmModal({ open, title, description, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
