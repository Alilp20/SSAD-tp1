import React from "react";
import Conversation from "./Conversation";

const ChatContainer = ({ currentUserId, users, onSelectUser }) => {
  return (
    <div className="w-full border-b border-gray-400/20">
      <Conversation users={users} currentUserId={currentUserId} onSelectUser={onSelectUser} />
    </div>
  );
};

export default ChatContainer;
