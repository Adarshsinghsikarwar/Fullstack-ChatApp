import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { formatMessageTime } from "../../lib/utils";

const ChatContainer = () => {
  const { messages, selectedChat, isMessagesLoading, getMessages } = useChat();
  const { authUser } = useAuth();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id, !!selectedChat.members);
    }
  }, [selectedChat, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="chat-container-shell">
        <ChatHeader />
        <div className="chat-messages-wrap chat-loading">
          Loading messages...
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-container-shell">
      <ChatHeader />
      <div className="chat-messages-wrap">
        {!messages.length && (
          <p className="chat-empty-state">
            No messages yet. Start the conversation.
          </p>
        )}

        {messages.map((message) => {
          const isMyMessage =
            message.senderId === authUser?._id ||
            message.senderId?._id === authUser?._id;
          const sender = message.senderId?._id
            ? message.senderId
            : isMyMessage
            ? authUser
            : selectedChat;

          return (
            <div
              key={message.id || message._id}
              className={`chat-message-row ${
                isMyMessage ? "chat-message-row-me" : "chat-message-row-them"
              }`}
              ref={messageEndRef}
            >
              <img
                src={sender?.profilePicture || "/avatar.png"}
                alt="profile"
                className="chat-message-avatar"
              />

              <div className="chat-message-content">
                <div className="chat-message-meta">
                  {!isMyMessage && selectedChat.members && (
                    <span className="chat-message-sender">
                      {sender?.fullName || "Unknown"}
                    </span>
                  )}
                  <time>
                    {formatMessageTime(message.createdAt || new Date())}
                  </time>
                </div>

                <div
                  className={`chat-message-bubble ${
                    isMyMessage
                      ? "chat-message-bubble-me"
                      : "chat-message-bubble-them"
                  }`}
                >
                  {message.media?.length > 0 &&
                    message.media.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.url}
                        alt="Attachment"
                        className="chat-message-media"
                      />
                    ))}
                  {message.content && <p>{message.content}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
