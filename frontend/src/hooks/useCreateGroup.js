import { useState } from "react";
import { useChat } from "../context/ChatContext";

const useCreateGroup = (onClose) => {
  const { users, createGroup, setSelectedChat } = useChat();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || selectedMembers.length === 0) return;

    const result = await createGroup({
      name,
      description,
      members: selectedMembers,
    });

    if (!result?.success) return;

    if (result.data) {
      setSelectedChat(result.data);
    }

    // Reset and close
    setName("");
    setDescription("");
    setSelectedMembers([]);
    setSearchTerm("");
    onClose();
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    name,
    setName,
    description,
    setDescription,
    selectedMembers,
    toggleMember,
    searchTerm,
    setSearchTerm,
    handleSubmit,
    filteredUsers,
  };
};

export default useCreateGroup;
