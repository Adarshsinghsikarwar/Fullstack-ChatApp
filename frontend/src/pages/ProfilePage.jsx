import React from "react";
import { Camera, Mail, User } from "lucide-react";
import useProfile from "../hooks/useProfile";

const ProfilePage = () => {
  const { authUser, selectedImg, isUpdatingProfile, handleImageUpload } =
    useProfile();

  return (
    <div className="profile-page">
      <div className="profile-card glass">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            <img
              src={selectedImg || authUser?.profilePicture || "/avatar.png"}
              alt="Profile"
            />
          </div>

          <label
            htmlFor="avatar-upload"
            className={`profile-upload-btn ${
              isUpdatingProfile ? "profile-upload-btn-disabled" : ""
            }`}
          >
            <Camera className="size-4" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>

        <div className="profile-photo-caption">
          <p>{isUpdatingProfile ? "Updating..." : "Change Photo"}</p>
          <span>JPG, PNG, or GIF, max 5MB.</span>
        </div>

        <div className="profile-fields">
          <div className="profile-field">
            <label>Full Name</label>
            <div className="profile-value">
              <User className="size-5" />
              <span>{authUser?.fullName || "Not available"}</span>
            </div>
          </div>

          <div className="profile-field">
            <label>Username</label>
            <div className="profile-value">
              <User className="size-5" />
              <span>@{authUser?.username || "unknown"}</span>
            </div>
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <div className="profile-value">
              <Mail className="size-5" />
              <span>{authUser?.email || "Not available"}</span>
            </div>
          </div>
        </div>

        <div className="profile-account-details">
          <h2>Account Details</h2>
          <div className="profile-detail-row">
            <span>Member Since</span>
            <strong>
              {authUser?.createdAt
                ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </strong>
          </div>
          <div className="profile-detail-row">
            <span>Account Status</span>
            <strong className="profile-status-active">Active</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
