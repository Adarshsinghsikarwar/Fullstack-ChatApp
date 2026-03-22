import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const useSidebar = () => {
  const { authUser } = useAuth();
  const {
    users,
    discoverUsers,
    incomingRequests,
    outgoingRequests,
    groups,
    selectedChat,
    setSelectedChat,
    isUsersLoading,
    isGroupsLoading,
    onlineUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getUsers,
    getGroups,
  } = useChat();

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const withoutMe = (list = []) =>
    list.filter((user) => String(user._id) !== String(authUser?._id));

  const safeUsers = withoutMe(users);
  const safeDiscoverUsers = withoutMe(discoverUsers);
  const safeIncomingRequests = withoutMe(incomingRequests);
  const safeOutgoingRequests = withoutMe(outgoingRequests);

  const filteredUsers = safeUsers.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDiscoverUsers = safeDiscoverUsers.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: safeUsers,
    discoverUsers: safeDiscoverUsers,
    incomingRequests: safeIncomingRequests,
    outgoingRequests: safeOutgoingRequests,
    groups,
    selectedChat,
    setSelectedChat,
    isUsersLoading,
    isGroupsLoading,
    onlineUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    searchTerm,
    setSearchTerm,
    isGroupModalOpen,
    setIsGroupModalOpen,
    filteredUsers,
    filteredDiscoverUsers,
  };
};

export default useSidebar;
