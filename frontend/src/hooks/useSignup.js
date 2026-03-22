import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const useSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuth();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) await signup(formData);
  };

  return {
    formData,
    setFormData,
    isSigningUp,
    handleSignup,
  };
};

export default useSignup;
