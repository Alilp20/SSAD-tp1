import React, { useEffect, useState } from "react";
import ChatContainer from "./ChatContainer";
import MessagesContainer from "./MessagesContainer";
import Profile from "./Profile";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { MdChat } from "react-icons/md";
import { FaUser, FaBomb } from "react-icons/fa";
import { FaCaretSquareRight } from "react-icons/fa";
import Attack from "./Attack";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Chat");

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

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    // Ensure the sidebar is only toggled when "Chat" is selected
    if (item !== "Chat") {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-900 h-screen">
      {/* Sidebar Menu */}
      <div className="w-20 text-gray-500 flex flex-col items-center justify-between py-5">
        <div
          className={`cursor-pointer hover:text-gray-600 transition duration-200 ${
            selectedMenuItem === "Chat" ? "text-gray-800 dark:text-white" : ""
          }`}
          onClick={() => handleMenuItemClick("Chat")}
        >
          <MdChat className="h-6 w-6" />
        </div>
        {/* Show toggle button only when Chat is selected */}
        {selectedMenuItem === "Chat" && (
          <button
            onClick={toggleSidebar}
            className="mt-2 bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
          >
            <FaCaretSquareRight className="h-6 w-6" />
          </button>
        )}
        <div
          className={`cursor-pointer hover:text-gray-600 transition duration-200 ${
            selectedMenuItem === "Profile"
              ? "text-gray-800 dark:text-white"
              : ""
          }`}
          onClick={() => handleMenuItemClick("Profile")}
        >
          <FaUser className="h-6 w-6" />
        </div>
        <div
          className={`cursor-pointer hover:text-gray-600 transition duration-200 ${
            selectedMenuItem === "Attack" ? "text-gray-800 dark:text-white" : ""
          }`}
          onClick={() => handleMenuItemClick("Attack")}
        >
          <FaBomb className="h-6 w-6" />
        </div>
      </div>

      {/* Sidebar */}
      {selectedMenuItem === "Chat" && isSidebarVisible && (
        <div className="dark:bg-gray-800 bg-gray-100 p-2 w-full sm:w-80 h-screen overflow-y-auto fixed top-0 left-24 z-50 sm:static">
          <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200 p-3">
            EncrypCHAT
          </div>
          <ChatContainer
            currentUserId={currentUserId}
            users={users}
            onSelectUser={handleUserSelect}
          />
        </div>
      )}

      {/* Messages Container */}
      {selectedMenuItem === "Chat" && (
        <MessagesContainer
          currentUserId={currentUserId}
          selectedUser={selectedUser}
        />
      )}
      {/* Profile Component */}
      {selectedMenuItem === "Profile" && (
        <div className="w-full h-screen">
          <Profile />
        </div>
      )}
      {/* Attack Component */}
      {selectedMenuItem === "Attack" && (
        <div className="w-full h-screen">
          <Attack />
        </div>
      )}
    </div>
  );
};

export default Chat;
