import React from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = ({ displayName }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <ChatWindow displayName={displayName} />
    </div>
  );
};

export default ChatPage;
