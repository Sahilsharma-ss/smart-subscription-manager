import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; //Used for notifications (toast messages)  like toast.success("Login successful");
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import AddSubscription from "./pages/AddSubscription.jsx";
import EditSubscription from "./pages/EditSubscription.jsx";
import Alerts from "./pages/Alerts.jsx";
import Survey from "./pages/Survey.jsx";

function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.08),_transparent_55%),radial-gradient(circle_at_20%_80%,_rgba(251,191,36,0.12),_transparent_40%)]">
      <Navbar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>  // all the components inside it is protected needs authentication 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/subscriptions/new" element={<AddSubscription />} />
          <Route path="/subscriptions/:id/edit" element={<EditSubscription />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/survey" element={<Survey />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
