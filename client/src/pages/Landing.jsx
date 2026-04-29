import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import logo from "../assets/a78e3ccc-52c9-4c59-87b6-a7bd8f4d3080.png";

function Landing() {
  useEffect(() => {
    document.title = "Smart Subscription Manager";
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.12),_transparent_55%),radial-gradient(circle_at_80%_30%,_rgba(251,191,36,0.12),_transparent_45%)] text-stone-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/15">
            <img
              src={logo}
              alt="Smart Subscription Manager"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Smart</p>
            <p className="text-lg font-semibold font-display">Subscription Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-teal-500"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(13,148,136,0.7)]"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-700">
            <Sparkles size={14} />
            Track every subscription in one place
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-stone-900 font-display lg:text-5xl">
            The minimal home for every recurring bill you forgot about.
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Stay ahead of renewals, spot unused services, and predict 30-day cost exposure with clarity.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(13,148,136,0.7)]"
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700"
            >
              View dashboard demo
            </Link>
          </div>
        </div>
        <div className="rounded-[32px] border border-stone-200 bg-white/80 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.6)] backdrop-blur">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Monthly spend</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">Rs. 8,450</p>
            </div>
            <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Next renewals</p>
              <p className="mt-2 text-lg font-semibold text-stone-900">Netflix, AWS, Notion</p>
            </div>
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Unused alerts</p>
              <p className="mt-2 text-lg font-semibold text-stone-900">3 services need review</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
