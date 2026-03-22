import React from "react";
import { X, Search } from "lucide-react";
import useCreateGroup from "../../hooks/useCreateGroup";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const {
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
  } = useCreateGroup(onClose);

  if (!isOpen) return null;

  return (
    <div className="group-modal-overlay" onClick={onClose}>
      <div
        className="group-modal-card glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="group-modal-header">
          <div>
            <h2>Create New Group</h2>
            <p>Pick members and start chatting together.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="group-modal-close-btn"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="group-modal-form">
          <div className="group-field">
            <label htmlFor="group-name">Group Name</label>
            <input
              id="group-name"
              type="text"
              className="group-text-input"
              placeholder="Enter group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="group-field">
            <label htmlFor="group-description">Description (Optional)</label>
            <textarea
              id="group-description"
              className="group-textarea-input"
              placeholder="What's this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="group-field">
            <div className="group-field-head">
              <label>Add Members</label>
              <span>{selectedMembers.length} selected</span>
            </div>

            <div className="group-search-wrap">
              <Search className="group-search-icon size-4" />
              <input
                type="text"
                className="group-member-search"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="group-member-list">
              {filteredUsers.map((user) => {
                const isSelected = selectedMembers.includes(user._id);

                return (
                  <button
                    key={user._id}
                    type="button"
                    className={`group-member-item ${
                      isSelected ? "group-member-item-selected" : ""
                    }`}
                    onClick={() => toggleMember(user._id)}
                  >
                    <div className="group-member-main">
                      <img
                        src={user.profilePicture || "/avatar.png"}
                        alt={user.fullName}
                        className="group-member-avatar"
                      />
                      <div className="group-member-text">
                        <strong>{user.fullName}</strong>
                        <span>@{user.username}</span>
                      </div>
                    </div>
                    <span
                      className={`group-member-check ${
                        isSelected ? "group-member-check-on" : ""
                      }`}
                    />
                  </button>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="group-member-empty">No users found</div>
              )}
            </div>
          </div>

          <div className="group-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="group-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group-create-btn"
              disabled={!name.trim() || selectedMembers.length === 0}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
