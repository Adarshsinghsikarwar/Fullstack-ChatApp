import React, { useState } from "react";
import { X, Users } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import ManageGroupMembersModal from "./ManageGroupMembersModal";

const ChatHeader = () => {
  const {
    selectedChat,
    setSelectedChat,
    onlineUsers,
    leaveGroup,
    deleteGroup,
  } = useChat();
  const { authUser } = useAuth();
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

  if (!selectedChat) return null;

  const isGroup = !!selectedChat.members;
  const isGroupCreator =
    isGroup &&
    String(selectedChat.admin?._id || selectedChat.admin) ===
      String(authUser?._id);

  const handleLeaveGroup = async () => {
    const shouldLeave = window.confirm(
      `Are you sure you want to leave ${selectedChat.name}?`
    );
    if (!shouldLeave) return;

    await leaveGroup(selectedChat._id);
  };

  const handleDeleteGroup = async () => {
    const shouldDelete = window.confirm(
      `Delete ${selectedChat.name}? This will remove all group messages for everyone.`
    );
    if (!shouldDelete) return;

    await deleteGroup(selectedChat._id);
  };

  return (
    <>
      <div className="chat-header-bar">
        <div className="chat-header-content">
          <div className="chat-header-identity">
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                {isGroup ? (
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                    <Users className="size-5" />
                  </div>
                ) : (
                  <img
                    src={selectedChat.profilePicture || "/avatar.png"}
                    alt={selectedChat.fullName}
                    className="rounded-full object-cover size-10"
                  />
                )}
              </div>
            </div>

            <div className="chat-header-info">
              <h3 className="font-medium">
                {isGroup ? selectedChat.name : selectedChat.fullName}
              </h3>
              <p>
                {isGroup
                  ? `${selectedChat.members.length} members`
                  : onlineUsers.includes(selectedChat._id)
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>

          <div className="chat-header-actions">
            {isGroup &&
              (isGroupCreator ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsManageMembersOpen(true)}
                    className="chat-header-action-btn"
                  >
                    Manage Members
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteGroup}
                    className="chat-header-action-btn chat-header-action-danger"
                  >
                    Delete Group
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLeaveGroup}
                  className="chat-header-action-btn chat-header-action-warn"
                >
                  Leave Group
                </button>
              ))}

            <button
              onClick={() => setSelectedChat(null)}
              className="chat-header-close-btn"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <ManageGroupMembersModal
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
        group={isGroup ? selectedChat : null}
      />
    </>
  );
};

export default ChatHeader;
