import React, { useEffect, useState } from "react";
import ChatContainer from "./ChatContainer";
import MessagesContainer from "./MessagesContainer";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { MdChat } from "react-icons/md";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State for sidebar visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchCurrentUser = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(user.uid);
        await fetchUsers();
      } else {
        console.error("No user is logged in.");
      }
    };

    fetchCurrentUser();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 h-screen">
      {/* Chat Icon as Toggle Button */}
      <div className="w-20 text-gray-500 flex flex-col items-center justify-between py-5">
        <MdChat
          className="h-6 w-6 cursor-pointer hover:text-gray-600 transition duration-200"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
      <div
        className={` dark:bg-gray-800 bg-gray-100 p-2 ${
          isSidebarVisible ? "hidden" : "md:block max-lg:fixed z-10 max-lg:ml-20 w-80 max-lg:w-screen h-screen"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200 p-3">
            EncrypCHAT
          </div>
          <ChatContainer
            currentUserId={currentUserId}
            users={users}
            onSelectUser={handleUserSelect}
          />
        </div>
      </div>

      {/* Messages Container */}
      <MessagesContainer
        currentUserId={currentUserId}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Chat;
