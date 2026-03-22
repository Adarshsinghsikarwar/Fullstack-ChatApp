import React, { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { useChat } from "../../context/ChatContext";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChat();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      content: text,
      media: imagePreview ? [{ url: imagePreview, mediaType: "image" }] : [],
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="chat-input-shell">
      {imagePreview && (
        <div className="chat-image-preview-wrap">
          <div className="chat-image-preview-box">
            <img
              src={imagePreview}
              alt="Preview"
              className="chat-image-preview"
            />
            <button
              onClick={removeImage}
              className="chat-image-remove-btn"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="chat-input-main">
          <input
            type="text"
            className="chat-text-input"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`chat-image-pick-btn ${
              imagePreview ? "chat-image-picked" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
