import React from 'react';

const MessageBubble = ({ isSent, message, timestamp, name, avatarUrl }) => (
    <div className={`flex items-end ${isSent ? 'justify-end' : ''}`}>
        {!isSent && <img className="w-8 h-8 m-3 rounded-full" src={avatarUrl} alt={`${name}'s avatar`} />}
        <div className={`p-3 ${isSent ? 'bg-purple-500 dark:bg-gray-800' : 'bg-purple-300 dark:bg-gray-800'} mx-3 my-1 rounded-2xl rounded-bl-none sm:w-3/4 md:w-3/6`}>
            {!isSent && <div className="text-xs text-gray-100 dark:text-gray-200">{name}</div>}
            <div className="text-gray-700 dark:text-gray-200">{message}</div>
            <div className="text-xs text-gray-400">{timestamp}</div>
        </div>
    </div>
);

export default MessageBubble;
