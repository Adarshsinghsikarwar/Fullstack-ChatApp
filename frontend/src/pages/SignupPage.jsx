import React, { useState } from "react";
import { Eye, EyeOff, Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import useSignup from "../hooks/useSignup";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, setFormData, isSigningUp, handleSignup } = useSignup();

  return (
    <div className="auth-shell auth-shell-signup">
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center size-10 rounded-xl bg-base-300 text-base-content mb-2 mx-auto">
            <MessageSquare className="size-5" />
          </div>
          <h2 className="text-xl font-bold text-base-content">Create Account</h2>
          <p className="text-xs text-base-content/60 mt-1">Start chatting with friends in minutes</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="auth-form-grid auth-form-signup-grid"
        >
          <div className="grid-2">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Full Name</span>
              </label>
              <input
                type="text"
                className="input-mono-sm w-full"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Username</span>
              </label>
              <input
                type="text"
                className="input-mono-sm w-full"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>

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
                  <EyeOff className="size-4.5 text-base-content/40" />
                ) : (
                  <Eye className="size-4.5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-mono-sm w-full auth-submit-btn"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-4.5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="auth-footer-text mt-3">
          <p className="text-xs">
            Already have an account?{" "}
            <Link to="/login" className="link-mono">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
