import groupModel from "../models/group.model.js";
import messageModel from "../models/message.model.js";

export async function createGroup(req, res) {
  try {
    const { name, members = [], description = "" } = req.body;
    const adminId = req.user.userId;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({ message: "Members must be an array" });
    }

    if (members.length === 0) {
      return res.status(400).json({ message: "Select at least one member" });
    }

    // Ensure admin is also a member
    const uniqueMembers = [
      ...new Set([...members.map(String), String(adminId)]),
    ];

    const newGroup = new groupModel({
      name: name.trim(),
      description: description?.trim(),
      admin: adminId,
      members: uniqueMembers,
    });

    await newGroup.save();

    const populatedGroup = await groupModel
      .findById(newGroup._id)
      .populate("members", "fullName profilePicture username")
      .populate("admin", "fullName profilePicture username");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error in createGroup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getGroups(req, res) {
  try {
    const userId = req.user.userId;
    const groups = await groupModel
      .find({
        members: { $in: [userId] },
      })
      .populate("members", "fullName profilePicture username")
      .populate("admin", "fullName profilePicture username");

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await groupModel.findById(groupId).select("members");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some(
      (memberId) => memberId.toString() === userId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    const messages = await messageModel
      .find({ groupId })
      .populate("senderId", "fullName profilePicture username")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateGroupMembers(req, res) {
  try {
    const { groupId } = req.params;
    const { members = [] } = req.body;
    const adminId = req.user.userId;

    if (!Array.isArray(members)) {
      return res.status(400).json({ message: "Members must be an array" });
    }

    const group = await groupModel.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Only admin can update members" });
    }

    // Keep admin as a member even when updating member list.
    group.members = [...new Set([...members.map(String), String(adminId)])];
    await group.save();

    const populatedGroup = await groupModel
      .findById(groupId)
      .populate("members", "fullName profilePicture username")
      .populate("admin", "fullName profilePicture username");

    res.status(200).json(populatedGroup);
  } catch (error) {
    console.error("Error in updateGroupMembers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function leaveGroup(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await groupModel.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() === userId) {
      return res.status(400).json({
        message: "Group creator cannot leave. Delete the group instead.",
      });
    }

    const isMember = group.members.some(
      (memberId) => memberId.toString() === userId
    );
    if (!isMember) {
      return res.status(400).json({ message: "You are not in this group" });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await group.save();

    return res.status(200).json({ message: "You left the group successfully" });
  } catch (error) {
    console.error("Error in leaveGroup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteGroup(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await groupModel.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== userId) {
      return res.status(403).json({
        message: "Only group creator can delete this group",
      });
    }

    await Promise.all([
      messageModel.deleteMany({ groupId: group._id }),
      groupModel.findByIdAndDelete(groupId),
    ]);

    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
