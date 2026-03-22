import React, { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { useChat } from "../../context/ChatContext";

const ManageGroupMembersModal = ({ isOpen, onClose, group }) => {
  const { users, updateGroupMembers } = useChat();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const adminId = String(group?.admin?._id || group?.admin || "");

  useEffect(() => {
    if (!isOpen || !group) return;

    const memberIds = (group.members || []).map((member) =>
      String(member?._id || member)
    );

    setSelectedMembers(memberIds);
    setSearchTerm("");
  }, [isOpen, group]);

  const availableMembers = useMemo(() => {
    const map = new Map();

    (group?.members || []).forEach((member) => {
      const id = String(member?._id || member);
      if (!id) return;

      map.set(id, {
        _id: id,
        fullName: member?.fullName || "Unknown user",
        username: member?.username || "unknown",
        profilePicture: member?.profilePicture || "",
      });
    });

    (users || []).forEach((user) => {
      const id = String(user?._id || "");
      if (!id) return;

      map.set(id, {
        _id: id,
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
      });
    });

    return [...map.values()].sort((a, b) =>
      (a.fullName || "").localeCompare(b.fullName || "")
    );
  }, [group, users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    if (!term.trim()) return availableMembers;

    return availableMembers.filter(
      (user) =>
        (user.fullName || "").toLowerCase().includes(term) ||
        (user.username || "").toLowerCase().includes(term)
    );
  }, [availableMembers, searchTerm]);

  const toggleMember = (memberId) => {
    if (memberId === adminId) return;

    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!group?._id) return;

    setIsSaving(true);
    const result = await updateGroupMembers(group._id, selectedMembers);
    setIsSaving(false);

    if (result?.success) {
      onClose();
    }
  };

  if (!isOpen || !group) return null;

  return (
    <div className="group-modal-overlay" onClick={onClose}>
      <div
        className="group-modal-card glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="group-modal-header">
          <div>
            <h2>Manage Group Members</h2>
            <p>Add, remove, and re-add members for {group.name}.</p>
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

        <form onSubmit={handleSave} className="group-modal-form">
          <div className="group-field">
            <div className="group-field-head">
              <label>Members</label>
              <span>{selectedMembers.length} selected</span>
            </div>

            <div className="group-search-wrap">
              <Search className="group-search-icon size-4" />
              <input
                type="text"
                className="group-member-search"
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="group-member-list">
              {filteredUsers.map((user) => {
                const userId = String(user._id);
                const isAdmin = userId === adminId;
                const isSelected = selectedMembers.includes(userId);

                return (
                  <button
                    key={userId}
                    type="button"
                    className={`group-member-item ${
                      isSelected ? "group-member-item-selected" : ""
                    } ${isAdmin ? "group-member-item-locked" : ""}`}
                    onClick={() => toggleMember(userId)}
                    disabled={isAdmin}
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

                    {isAdmin ? (
                      <span className="group-admin-pill">Creator</span>
                    ) : (
                      <span
                        className={`group-member-check ${
                          isSelected ? "group-member-check-on" : ""
                        }`}
                      />
                    )}
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
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group-create-btn"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageGroupMembersModal;
