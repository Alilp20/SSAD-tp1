import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // Make sure to import the necessary Firebase functions

// The Attack component
const Attack = () => {
  const [users, setUsers] = useState([]); // State to hold the users
  const [selectedUser, setSelectedUser] = useState(null);
  const [attackResult, setAttackResult] = useState('');
  const [isAttacking, setIsAttacking] = useState(false); // To track ongoing attacks
  const [attackStartTime, setAttackStartTime] = useState(0); // To track start time of the attack
  const [elapsedTime, setElapsedTime] = useState(0); // To track elapsed time
  const [currentUserId, setCurrentUserId] = useState(null); // State to hold current user ID

  // Simulate dictionary attack passwords, including random alphanumeric passwords
  const dictionary = [
    'a1b2c3', '3d2c1a', 'f4g5h6', '123456', 'abc123', '1qaz2wsx', 
    'password', 'qwerty', '1a2b3c', 'abcdef', '239227', 'xyz789'
  ];

  // Fetch users from users.js on component mount
  const fetchUsers = async () => {
    try {
      const response = await fetch('/users.json'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data); // Assuming the data is an array of users
      console.log('Fetched Users:', data); // Log fetched users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch current user and their corresponding users
  const fetchCurrentUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
      await fetchUsers(); // Fetch users after getting current user
    } else {
      console.error("No user is logged in.");
    }
  };

  // Call fetchCurrentUser when the component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Update elapsed time every second while attacking
  useEffect(() => {
    let timer;
    if (isAttacking) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0); // Reset elapsed time when not attacking
    }
    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [isAttacking]);

  // Handle attack using dictionary method
  const performDictionaryAttack = (password) => {
    const startTime = performance.now(); // Start timer
    const foundPassword = dictionary.find((word) => word === password);
    const endTime = performance.now(); // End timer
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Calculate time taken in seconds

    if (foundPassword) {
      setAttackResult(`Success: Found password "${foundPassword}" for ${selectedUser.userName} using dictionary attack in ${timeTaken} seconds.`);
    } else {
      setAttackResult(`Failed: Password not found for ${selectedUser.userName} using dictionary attack in ${timeTaken} seconds.`);
    }
  };

  // Handle brute force attack for 6-character alphanumeric passwords
  const performBruteForceAttack = (password) => {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Alphanumeric characters
    const maxLength = 6; // Set to 6 for the password length
    const startTime = performance.now(); // Start timer
    setIsAttacking(true); // Set attacking state to true
    setAttackStartTime(Date.now()); // Set start time for the attack
    setAttackResult(''); // Reset previous results

    let found = false;
    const totalCombinations = Math.pow(charset.length, maxLength);
    let currentAttempt = 0; // Track attempts

    const attemptNextCombination = () => {
      if (found || currentAttempt >= totalCombinations) {
        setIsAttacking(false); // Reset attacking state
        return;
      }

      let attempt = '';
      for (let j = 0; j < maxLength; j++) {
        attempt += charset.charAt((currentAttempt / Math.pow(charset.length, j)) % charset.length | 0);
      }

      if (attempt === password) {
        found = true;
        const endTime = performance.now(); // End timer
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Calculate time taken in seconds
        setAttackResult(`Success: Found password "${attempt}" for ${selectedUser.userName} using brute force attack in ${timeTaken} seconds.`);
      } else {
        currentAttempt++;
        setTimeout(attemptNextCombination, 0); // Schedule next attempt
      }
    };

    attemptNextCombination(); // Start attempting combinations
  };

  // Format elapsed time into minutes and seconds
  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="attack-container text-white">
      <h1 className="text-xl font-bold">Choose a User to Attack</h1>

      <select 
        onChange={(e) => {
          const user = users.find(user => user.uid === e.target.value); // Use uid for selection
          setSelectedUser(user);
        }}
        className="border rounded p-2 mb-4 text-black"
      >
        <option value="">Select a user</option>
        {users
          .filter(user => user.uid !== currentUserId) // Filter out the current user
          .map(user => (
            <option key={user.uid} value={user.uid}>{user.userName}</option> // Display userName
          ))}
      </select>

      {selectedUser && (
        <div>
          <h2 className="text-lg">Attacking {selectedUser.userName}</h2>

          <button 
            onClick={() => performDictionaryAttack(selectedUser.password)} 
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
          >
            Dictionary Attack
          </button>
          <button 
            onClick={() => performBruteForceAttack(selectedUser.password)} 
            className="bg-red-500 text-white py-2 px-4 rounded"
            disabled={isAttacking} // Disable button during attack
          >
            Brute Force Attack
          </button>

          {isAttacking && (
            <div className="mt-2">
              <span>Loading... </span>
              <span>Elapsed Time: {formatElapsedTime(elapsedTime)}</span>
            </div>
          )}
        </div>
      )}

      {attackResult && (
        <div className="mt-4 p-2 border rounded">
          <strong>Result:</strong> {attackResult}
        </div>
      )}
    </div>
  );
};

export default Attack;
