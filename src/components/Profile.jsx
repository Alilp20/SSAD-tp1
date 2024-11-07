import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, updatePassword } from "firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordMethod, setPasswordMethod] = useState("3-char");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              console.log("User data fetched:", userDoc.data());
              setUserData(userDoc.data());
            } else {
              console.log("No such user document found in Firestore.");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchUserData();
      } else {
        console.log("No user is logged in");
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const generatePassword = () => {
    let password = "";

    switch (passwordMethod) {
      case "3-char":
        for (let i = 0; i < 3; i++) {
          password += Math.floor(Math.random() * 3);
        }
        break;

      case "6-digit":
        for (let i = 0; i < 6; i++) {
          password += Math.floor(Math.random() * 10);
        }
        break;

      case "alphanumeric":
        const chars =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+*";
        for (let i = 0; i < 6; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        break;

      default:
        break;
    }

    setGeneratedPassword(password);
    setNewPassword(password);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      alert("Please enter a password before updating.");
      return;
    }

    try {
      const user = auth.currentUser;

      
      await updatePassword(user, newPassword); 

      
      const response = await fetch(
        `http://localhost:3000/api/users/${userData.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || "Failed to update password";
        throw new Error(errorMessage);
      }

      console.log("Password updated successfully.");
      alert("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(`Error updating password: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-white bg-gray-900 h-screen flex items-center justify-center">
        Loading user data...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-white bg-gray-900 h-screen flex items-center justify-center">
        No user data available. Please log in.
      </div>
    );
  }

  return (
    <div className="profile-page bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">User Profile</h1>
        <div className="w-16 h-16 my-10 mx-auto">
          <img
            className="rounded-full"
            src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
            alt="avatar"
          />
        </div>
        <div className="profile-details mt-4">
          <p className="mb-2 text-center">
            <strong>Username:</strong> {userData.userName || "No username set"}
          </p>
          <p className="mb-2 text-center">
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
        <div className="flex items-center justify-center mt-4">
          <select
            value={passwordMethod}
            onChange={(e) => setPasswordMethod(e.target.value)}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 mr-2"
          >
            <option value="3-char">3 characters (0, 1, 2)</option>
            <option value="6-digit">6 digits (0-9)</option>
            <option value="alphanumeric">
              6 characters (a-z, A-Z, 0-9, +, *)
            </option>
          </select>
          <button
            onClick={generatePassword}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Generate Password
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg">
            <strong>Generated Password:</strong> {generatedPassword}
          </p>
        </div>
        <input
          type="text"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-4 p-2 bg-gray-700 text-white rounded w-full"
          placeholder="Update your password"
        />
        <button
          onClick={handleUpdatePassword}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200 w-full"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
