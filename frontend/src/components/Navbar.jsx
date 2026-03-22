import React from "react";
import { Link, NavLink } from "react-router";
import { LogOut, MessageSquare, User, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { authUser, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-40 glass border-b border-base-300">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group transition-all duration-300">
              <div className="size-10 rounded-xl bg-primary-gradient p-[2px] shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-base-100 rounded-[10px] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-xl font-bold bg-primary-gradient bg-clip-text text-transparent tracking-tight">
                ChatApp
              </h1>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/settings"
              className={({ isActive }) => 
                `btn btn-sm gap-2 transition-all duration-200 border border-transparent
                ${isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-base-200 hover:bg-base-300"}`
              }
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </NavLink>

            {authUser && (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => 
                    `btn btn-sm gap-2 transition-all duration-200 border border-transparent
                    ${isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-base-200 hover:bg-base-300"}`
                  }
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </NavLink>

                <button
                  onClick={logout}
                  className="btn btn-sm gap-2 bg-error/10 text-error hover:bg-error/20 border border-error/20 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
