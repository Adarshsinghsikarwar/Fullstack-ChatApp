import React, { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Loader2, MessageSquare } from "lucide-react";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, setFormData, isLoggingIn, handleLogin } = useLogin();

  return (
    <div className="auth-shell auth-shell-login">
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center size-10 rounded-xl bg-base-300 text-base-content mb-2 mx-auto">
            <MessageSquare className="size-5" />
          </div>
          <h2 className="text-xl font-bold text-base-content">Welcome Back</h2>
          <p className="text-xs text-base-content/60 mt-1">Sign in to continue chatting</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form-grid">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Email</span>
            </label>
            <input
              type="email"
              className="input-mono-sm w-full"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-medium text-xs">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input-mono-sm w-full pr-8"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5 text-base-content/40" />
                ) : (
                  <Eye className="h-4.5 w-4.5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-mono-sm w-full auth-submit-btn"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="auth-footer-text mt-3">
          <p className="text-xs">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="link-mono">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
