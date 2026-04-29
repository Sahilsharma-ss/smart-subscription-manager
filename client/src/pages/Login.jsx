import { Eye, EyeOff, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/a78e3ccc-52c9-4c59-87b6-a7bd8f4d3080.png";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login | Smart Subscription Manager";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await api.post("/api/auth/login", { email, password });
      login(response.data.token, response.data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Login failed. Please try again.");
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
              <h1 className="text-xl font-semibold text-stone-900 font-display">Welcome back</h1>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-stone-600">Email</label>
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600">Password</label>
              <div className="mt-2 flex items-center rounded-xl border border-stone-200 bg-white/80 px-4 py-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full text-sm focus:outline-none"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

            {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(13,148,136,0.7)]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-500">
            New here?{" "}
            <Link className="font-semibold text-teal-700" to="/register">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
