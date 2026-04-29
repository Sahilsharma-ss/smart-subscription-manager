import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/a78e3ccc-52c9-4c59-87b6-a7bd8f4d3080.png";

function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Register | Smart Subscription Manager";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const response = await api.post("/api/auth/register", form);
      login(response.data.token, response.data.user);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.12),_transparent_55%),radial-gradient(circle_at_80%_30%,_rgba(251,191,36,0.12),_transparent_45%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white/80 p-8 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.6)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10">
              <img
                src={logo}
                alt="Smart Subscription Manager"
                className="h-9 w-9 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-stone-400">Smart Subscription</p>
              <h1 className="text-xl font-semibold text-stone-900 font-display">Create account</h1>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-stone-600">Full name</label>
              <input
                name="name"
                type="text"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Email</label>
              <input
                name="email"
                type="email"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Phone (optional)</label>
              <input
                name="phone"
                type="text"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Password</label>
              <div className="mt-2 flex items-center rounded-xl border border-stone-200 bg-white/80 px-4 py-3">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full text-sm focus:outline-none"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-stone-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-600">Currency</label>
                <select
                  name="currency"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-3 text-sm"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600">Timezone</label>
                <input
                  name="timezone"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-3 text-sm"
                  value={form.timezone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(13,148,136,0.7)]"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-500">
            Already have an account?{" "}
            <Link className="font-semibold text-teal-700" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
