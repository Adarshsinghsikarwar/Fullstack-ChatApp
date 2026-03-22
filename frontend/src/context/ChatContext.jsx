import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { axiosInstance } from "../lib/axios.js";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const BASE_URL = "https://fullstack-chatapp-0dvc.onrender.com";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { authUser } = useAuth();

  // Socket Connection logic - Only depends on authUser
  useEffect(() => {
    if (authUser) {
      const newSocket = io(BASE_URL, {
        query: { userId: authUser._id },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  // Socket Message Listener - Depends on selectedChat and socket
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        const isSelectedChat =
          selectedChat?._id === message.senderId ||
          selectedChat?._id === message.recipientId ||
          selectedChat?._id === message.groupId;

        if (isSelectedChat) {
          setMessages((prev) => {
            const exists = prev.some(
              (m) => (m._id || m.id) === (message._id || message.id)
            );
            return exists ? prev : [...prev, message];
          });
        }
      };

      socket.on("newMessage", handleNewMessage);
      return () => socket.off("newMessage", handleNewMessage);
    }
  }, [socket, selectedChat]);

  const getUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/auth/friends");
      setUsers(res.data.friends || []);
      setIncomingRequests(res.data.incomingRequests || []);
      setOutgoingRequests(res.data.outgoingRequests || []);
      setDiscoverUsers(res.data.discoverUsers || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  const sendFriendRequest = useCallback(
    async (userId) => {
      try {
        await axiosInstance.post(`/auth/friends/request/${userId}`);
        toast.success("Friend request sent");
        await getUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send request");
      }
    },
    [getUsers]
  );

  const acceptFriendRequest = useCallback(
    async (userId) => {
      try {
        await axiosInstance.post(`/auth/friends/accept/${userId}`);
        toast.success("Friend request accepted");
        await getUsers();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to accept request"
        );
      }
    },
    [getUsers]
  );

  const rejectFriendRequest = useCallback(
    async (userId) => {
      try {
        await axiosInstance.post(`/auth/friends/reject/${userId}`);
        toast.success("Friend request rejected");
        await getUsers();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to reject request"
        );
      }
    },
    [getUsers]
  );

  const removeFriend = useCallback(
    async (userId) => {
      try {
        await axiosInstance.delete(`/auth/friends/remove/${userId}`);
        toast.success("Friend removed");

        if (String(selectedChat?._id) === String(userId)) {
          setSelectedChat(null);
          setMessages([]);
        }

        await getUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove friend");
      }
    },
    [getUsers, selectedChat]
  );

  const getGroups = useCallback(async () => {
    setIsGroupsLoading(true);
    try {
      const res = await axiosInstance.get("/groups/list");
      setGroups(res.data);
      // Join all group rooms
      res.data.forEach((group) => {
        socket?.emit("joinGroup", group._id);
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      setIsGroupsLoading(false);
    }
  }, [socket]);

  const getMessages = useCallback(async (chatId, isGroup = false) => {
    setIsMessagesLoading(true);
    try {
      const url = isGroup
        ? `/groups/messages/${chatId}`
        : `/messages/${chatId}`;
      const res = await axiosInstance.get(url);
      setMessages(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (messageData) => {
      if (!selectedChat) return;
      try {
        const isGroup = !!selectedChat.members;
        const url = `/messages/send/${selectedChat._id}`;
        const data = isGroup
          ? { ...messageData, groupId: selectedChat._id }
          : messageData;

        const res = await axiosInstance.post(url, data);

        // Group message will arrive through socket room broadcast. For direct message,
        // append optimistic server response immediately.
        if (!isGroup) {
          setMessages((prev) => {
            const exists = prev.some(
              (m) => (m._id || m.id) === (res.data._id || res.data.id)
            );
            return exists ? prev : [...prev, res.data];
          });
        }

        return { success: true, data: res.data };
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send message");
        return { success: false };
      }
    },
    [selectedChat]
  );

  const createGroup = useCallback(
    async (groupData) => {
      try {
        const res = await axiosInstance.post("/groups/create", groupData);
        setGroups((prev) => [...prev, res.data]);
        socket?.emit("joinGroup", res.data._id);
        toast.success("Group created successfully");
        return { success: true, data: res.data };
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create group");
        return { success: false };
      }
    },
    [socket]
  );

  const updateGroupMembers = useCallback(async (groupId, members) => {
    try {
      const res = await axiosInstance.put(`/groups/update/${groupId}`, {
        members,
      });

      setGroups((prev) =>
        prev.map((group) => (group._id === groupId ? res.data : group))
      );

      setSelectedChat((prev) => (prev?._id === groupId ? res.data : prev));

      toast.success("Group members updated");
      return { success: true, data: res.data };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update group members"
      );
      return { success: false };
    }
  }, []);

  const leaveGroup = useCallback(
    async (groupId) => {
      try {
        const res = await axiosInstance.post(`/groups/${groupId}/leave`);

        setGroups((prev) => prev.filter((group) => group._id !== groupId));

        if (selectedChat?._id === groupId) {
          setSelectedChat(null);
          setMessages([]);
        }

        socket?.emit("leaveGroup", groupId);

        toast.success(res.data?.message || "You left the group");
        return { success: true };
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to leave group");
        return { success: false };
      }
    },
    [selectedChat, socket]
  );

  const deleteGroup = useCallback(
    async (groupId) => {
      try {
        const res = await axiosInstance.delete(`/groups/${groupId}`);

        setGroups((prev) => prev.filter((group) => group._id !== groupId));

        if (selectedChat?._id === groupId) {
          setSelectedChat(null);
          setMessages([]);
        }

        socket?.emit("leaveGroup", groupId);

        toast.success(res.data?.message || "Group deleted");
        return { success: true };
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete group");
        return { success: false };
      }
    },
    [selectedChat, socket]
  );

  const value = useMemo(
    () => ({
      messages,
      users,
      discoverUsers,
      incomingRequests,
      outgoingRequests,
      groups,
      selectedChat,
      setSelectedChat,
      isUsersLoading,
      isGroupsLoading,
      isMessagesLoading,
      getUsers,
      getGroups,
      getMessages,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      sendMessage,
      createGroup,
      updateGroupMembers,
      leaveGroup,
      deleteGroup,
      onlineUsers,
      socket,
    }),
    [
      messages,
      users,
      discoverUsers,
      incomingRequests,
      outgoingRequests,
      groups,
      selectedChat,
      isUsersLoading,
      isGroupsLoading,
      isMessagesLoading,
      getUsers,
      getGroups,
      getMessages,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      sendMessage,
      createGroup,
      updateGroupMembers,
      leaveGroup,
      deleteGroup,
      onlineUsers,
      socket,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
