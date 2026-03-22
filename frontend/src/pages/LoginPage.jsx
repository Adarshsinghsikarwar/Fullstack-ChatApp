import React, { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, setFormData, isLoggingIn, handleLogin } = useLogin();

  return (
    <div className="auth-shell auth-shell-login">
      <section className="auth-form-side">
        <div className="auth-card glass animate-fade-in">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <MessageSquare className="size-6" />
            </div>
            <p className="auth-brand-name">ChatApp</p>
          </div>

          <div className="auth-heading">
            <h1>Welcome back</h1>
            <p>Sign in and continue your conversations.</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form-grid">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full auth-submit-btn"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="auth-footer-text">
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="auth-hero-side">
        <AuthImagePattern
          title="Conversations, uninterrupted"
          subtitle="Pick up where you left off with your friends and groups."
        />
      </section>
    </div>
  );
};

export default LoginPage;
