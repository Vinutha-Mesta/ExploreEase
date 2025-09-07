import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";  // ✅ added

const Login = ({ onToggleAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError("Please fill in all fields");

    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard"); // ✅ redirect after login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}
          <div className="space-y-4">
            <div>
              <label>Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className="pl-10 w-full border rounded-md py-3"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="pl-10 pr-12 w-full border rounded-md py-3"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-md">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center">
            <button type="button" onClick={onToggleAuth} className="text-primary-600">Don't have an account? Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
