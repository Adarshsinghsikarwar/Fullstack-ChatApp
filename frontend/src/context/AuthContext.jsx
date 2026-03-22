import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setAuthUser(res.data.user);
    } catch (error) {
      console.log("Error in checkAuth:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signup = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      setAuthUser(res.data.user);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      setAuthUser(res.data.user);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      setAuthUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isCheckingAuth,
        isUpdatingProfile,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
