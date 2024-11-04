import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import MessagesList from "./MessagesList";

const MessagesContainer = ({ currentUserId, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      const conversationId = [currentUserId, selectedUser.id].sort().join("_");
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, where("conversationId", "==", conversationId));

      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => {
          const messageData = doc.data();
          return {
            id: doc.id,
            ...messageData,
            isSent: messageData.senderId === currentUserId,
          };
        });
        setMessages(fetchedMessages);
        setError(null);
      }, (error) => {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages. Please try again later.");
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [currentUserId, selectedUser]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const newMessage = {
      messageText,
      senderId: currentUserId,
      receiverId: selectedUser.id,
      conversationId: [currentUserId, selectedUser.id].sort().join("_"),
      isRead: false,
      timestamp: serverTimestamp(),
    };

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, newMessage);
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex-grow p-4">
      {selectedUser ? (
        <>
          <MessagesList
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={currentUserId}
          />
          {error && <p className="text-red-500 text-sm p-2">{error}</p>}
        </>
      ) : (
        <div className="p-4 text-gray-500">Select a user to start chatting</div>
      )}
    </div>
  );
};

export default MessagesContainer;
