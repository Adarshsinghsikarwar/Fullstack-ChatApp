import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const useLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return {
    formData,
    setFormData,
    isLoggingIn,
    handleLogin,
  };
};

export default useLogin;
