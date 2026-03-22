import React from "react";
import { Users, Search, Plus, MessageSquare, UserMinus } from "lucide-react";
import CreateGroupModal from "../chat/CreateGroupModal";
import useSidebar from "../../hooks/useSidebar";

const Sidebar = () => {
  const {
    users,
    incomingRequests,
    outgoingRequests,
    groups,
    selectedChat,
    setSelectedChat,
    isUsersLoading,
    isGroupsLoading,
    onlineUsers,
    searchTerm,
    setSearchTerm,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    isGroupModalOpen,
    setIsGroupModalOpen,
    filteredUsers,
    filteredDiscoverUsers,
  } = useSidebar();

  if (isUsersLoading || isGroupsLoading) {
    return (
      <aside className="sidebar-shell">
        <div className="sidebar-loading">Loading...</div>
      </aside>
    );
  }

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-header">
        <div className="sidebar-header-row">
          <div className="sidebar-title-wrap">
            <div className="sidebar-title-icon">
              <Users className="size-5" />
            </div>
            <span className="sidebar-title">Contacts</span>
          </div>
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="sidebar-create-group-btn"
            title="Create Group"
            type="button"
          >
            <Plus className="size-5" />
          </button>
        </div>

        <div className="sidebar-search-wrap">
          <input
            type="text"
            placeholder="Search users to add or chat..."
            className="sidebar-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="sidebar-search-icon size-4" />
        </div>
      </div>

      <div className="sidebar-content">
        {groups.length > 0 && (
          <section className="sidebar-section">
            <div className="sidebar-section-title">Groups</div>
            <div className="sidebar-list">
              {groups.map((group) => (
                <button
                  key={group._id}
                  onClick={() => setSelectedChat(group)}
                  className={`sidebar-list-item ${
                    selectedChat?._id === group._id
                      ? "sidebar-list-item-active"
                      : ""
                  }`}
                  type="button"
                >
                  <div
                    className={`sidebar-group-icon ${
                      selectedChat?._id === group._id
                        ? "sidebar-group-icon-active"
                        : ""
                    }`}
                  >
                    <MessageSquare className="size-6" />
                  </div>
                  <div className="sidebar-item-text">
                    <div className="sidebar-item-title">{group.name}</div>
                    <div className="sidebar-item-subtitle">
                      {group.members.length} members
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="sidebar-section">
          <div className="sidebar-section-title">Friends</div>
          <div className="sidebar-list">
            {filteredUsers.map((user) => (
              <div key={user._id} className="sidebar-friend-row">
                <button
                  type="button"
                  onClick={() => setSelectedChat(user)}
                  className={`sidebar-friend-main ${
                    selectedChat?._id === user._id
                      ? "sidebar-friend-main-active"
                      : ""
                  }`}
                >
                  <div className="sidebar-avatar-wrap avatar">
                    <img
                      src={user.profilePicture || "/avatar.png"}
                      alt={user.fullName}
                      className="sidebar-avatar"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="sidebar-online-dot" />
                    )}
                  </div>

                  <div className="sidebar-item-text">
                    <div className="sidebar-item-title">{user.fullName}</div>
                    <div
                      className={`sidebar-item-subtitle ${
                        onlineUsers.includes(user._id)
                          ? "sidebar-online-text"
                          : ""
                      }`}
                    >
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className="sidebar-remove-btn"
                  title="Remove friend"
                  onClick={() => removeFriend(user._id)}
                >
                  <UserMinus className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="sidebar-empty">No friends found.</div>
          )}
        </section>

        {incomingRequests.length > 0 && (
          <section className="sidebar-section">
            <div className="sidebar-section-title">Friend Requests</div>
            <div className="sidebar-list">
              {incomingRequests.map((user) => (
                <div key={user._id} className="sidebar-request-card">
                  <div className="sidebar-request-user">
                    <img
                      src={user.profilePicture || "/avatar.png"}
                      alt={user.fullName}
                      className="sidebar-request-avatar"
                    />
                    <div className="sidebar-item-text">
                      <div className="sidebar-item-title">{user.fullName}</div>
                      <div className="sidebar-item-subtitle">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-request-actions">
                    <button
                      type="button"
                      className="sidebar-accept-btn"
                      onClick={() => acceptFriendRequest(user._id)}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="sidebar-reject-btn"
                      onClick={() => rejectFriendRequest(user._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="sidebar-section sidebar-section-last">
          <div className="sidebar-section-title">Find Friends</div>
          <div className="sidebar-list">
            {filteredDiscoverUsers.map((user) => {
              const isPending = outgoingRequests.some(
                (pendingUser) => pendingUser._id === user._id
              );

              return (
                <div key={user._id} className="sidebar-discover-row">
                  <div className="sidebar-request-user">
                    <img
                      src={user.profilePicture || "/avatar.png"}
                      alt={user.fullName}
                      className="sidebar-request-avatar"
                    />
                    <div className="sidebar-item-text">
                      <div className="sidebar-item-title">{user.fullName}</div>
                      <div className="sidebar-item-subtitle">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="sidebar-add-btn"
                    disabled={isPending}
                    onClick={() => sendFriendRequest(user._id)}
                  >
                    {isPending ? "Pending" : "Add"}
                  </button>
                </div>
              );
            })}

            {filteredDiscoverUsers.length === 0 && (
              <div className="sidebar-empty">No users to add right now.</div>
            )}
          </div>
        </section>
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
