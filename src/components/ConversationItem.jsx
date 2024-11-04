import React from "react";

const ConversationItem = ({ name, onClick }) => {
  return (
    <div
      className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
      onClick={onClick} // Call onClick when the item is clicked
    >
      <div className="w-7 h-7 m-1 mr-2">
        <img
          className="rounded-full"
          src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
          alt="avatar"
        />
      </div>{" "}
      {/* Placeholder for avatar */}
      <span className="font-semibold text-white">{name}</span>
    </div>
  );
};

export default ConversationItem;
