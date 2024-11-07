import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPaperPlane, FaLock, FaEllipsisV } from "react-icons/fa";

const MessagesList = ({ messages = [], onSendMessage, currentUserId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEncryptionMethods, setShowEncryptionMethods] = useState(false);
  const [encryptionMethod, setEncryptionMethod] = useState("Mirroring");
  const [decryptedMessages, setDecryptedMessages] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageToSend = encryptMessage(newMessage);
      console.log("Sending encrypted message:", messageToSend);
      onSendMessage(messageToSend);
      setNewMessage("");
    }
  };

  const toggleEncryptionMethods = () => {
    setShowEncryptionMethods((prev) => !prev);
    console.log("Toggled encryption methods:", !showEncryptionMethods);
  };

  const selectEncryptionMethod = (method) => {
    setEncryptionMethod(method);
    setShowEncryptionMethods(false);
    console.log("Selected encryption method:", method);
  };

  const decryptMessage = (message, method) => {
    console.log("Decrypting message:", message, "with method:", method);
    switch (method) {
      case "Mirroring":
        return mirrorDecrypt(message, 2);
      case "Caesar":
        return caesarDecrypt(message, 3); // cesar with a=3
      case "Affine":
        return affineDecrypt(message, 4, 8); //  affine with a=5, b=8
      case "Shift":
        return caesarDecrypt(message, 1); // Shift with 1
      case "Steganography":
        return decodeSteganography(message, codebook2);
      default:
        return message;
    }
  };

  const encryptMessage = (message) => {
    console.log(
      "Encrypting message:",
      message,
      "with method:",
      encryptionMethod
    );
    if (encryptionMethod) {
      switch (encryptionMethod) {
        case "Mirroring":
          return mirrorEncrypt(message, 2); // Splitting each message into chunks of 2 characters and then reverse them
        case "Caesar":
          return caesarEncrypt(message, 3); // Caesar of 3
        case "Affine":
          return affineEncrypt(message, 4, 8); // a=5, b=8
        case "Shift":
          return caesarEncrypt(message, 1); // Shift of 1
        case "Steganography":
          return steganography(message, codebook);
        default:
          return message; // Default to plain text if invalid method
      }
    } else {
      // Default encryption (Mirroring)
      return message.split("").reverse().join("");
    }
  };

  const mirrorEncrypt = (message, key) => {
    console.log(
      "Encrypting message:",
      message,
      "with method:",
      encryptionMethod
    );

    if (encryptionMethod === "Mirroring") {
      // Split the message into chunks based on the key
      const keyPattern = parseInt(key) || 2; // Use 2 as a default if the key isn't provided
      let encryptedMessage = "";

      for (let i = 0; i < message.length; i += keyPattern) {
        const chunk = message.substring(i, i + keyPattern);
        encryptedMessage += chunk.split("").reverse().join("");
      }

      // Add random padding (optional)
      const paddingStart = Math.random().toString(36).substring(2, 5); // Generate 3 random characters
      const paddingEnd = Math.random().toString(36).substring(2, 5); // Generate 3 random characters
      return paddingStart + encryptedMessage + paddingEnd;
    }
  };

  const mirrorDecrypt = (encryptedMessage, key) => {
    console.log(
      "Decrypting message:",
      encryptedMessage,
      "with method: Mirroring"
    );

    // Remove padding 3 characters for both start and end
    const strippedMessage = encryptedMessage.slice(3, -3);

    // Split the message into chunks based on the key
    const keyPattern = parseInt(key) || 2; // Use 2 as a default if the key isn't provided
    let decryptedMessage = "";

    for (let i = 0; i < strippedMessage.length; i += keyPattern) {
      const chunk = strippedMessage.substring(i, i + keyPattern);
      decryptedMessage += chunk.split("").reverse().join("");
    }

    return decryptedMessage;
  };

  function caesarEncrypt(message, shift) {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let encryptedMessage = "";

    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      const charIndex = alphabet.indexOf(char);

      if (charIndex !== -1) {
        const shiftedIndex =
          (charIndex + shift + alphabet.length) % alphabet.length;
        encryptedMessage += alphabet[shiftedIndex];
      } else {
        encryptedMessage += char; // Keep non-alphabetic characters unchanged
      }
    }

    return encryptedMessage;
  }

  const caesarDecrypt = (message, shift) => {
    return message
      .split("")
      .map((char) => {
        if (char.match(/[a-zA-Z]/)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base - shift + 26) % 26) + base);
        }
        return char;
      })
      .join("");
  };

  function affineEncrypt(message, a, b) {
    const characterSet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?' ";
    console.log("encrypt affine character length = " + characterSet.length);
    const m = characterSet.length; // Length of the character set

    // Validate 'a' is coprime to 'm'
    if (!isValidKey(a, m)) {
      throw new Error(
        "The value of 'a' must be coprime to " +
          m +
          " and within the range of 1-" +
          (m - 1) +
          "."
      );
    }

    return message
      .split("")
      .map((char) => {
        const index = characterSet.indexOf(char); // Get the index of the character in the set
        if (index !== -1) {
          // Only process characters in the character set
          return characterSet[
            (((a * index + b) % m) + m) % m // Apply the affine encryption formula
          ];
        }
        return char; // Keep non-character set characters unchanged
      })
      .join("");
  }

  function affineDecrypt(message, a, b) {
    const characterSet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?' ";
    console.log("decrypt affine character length = " + characterSet.length);
    const m = characterSet.length; // Length of the character set
    const aInverse = modInverse(a, m);

    console.log("mod inverse of a = "+aInverse);

    if (aInverse === undefined) {
      throw new Error(
        "No modular inverse found for 'a'. Ensure 'a' is coprime to 88."
      );
    }

    return message
      .split("")
      .map((char) => {
        const index = characterSet.indexOf(char); // Get the index of the character in the set
        if (index !== -1) {
          // Only process characters in the character set
          return characterSet[
            (((aInverse * (index - b + m)) % m) + m) % m // Apply the affine decryption formula
          ];
        }
        return char; // Keep non-character set characters unchanged
      })
      .join("");
  }

  function steganography(message, codebook) {
    const trimmedMessage = message.trim(); // Remove leading and trailing spaces
    const words = trimmedMessage.match(/\b\w+\b/g) || []; // Split on word boundaries
    console.log(words);
    const encodedMessage = words
      .map((word) => codebook[word] || word)
      .join(" ");
    return encodedMessage;
  }

  function decodeSteganography(encodedMessage, codebook) {
    const words = encodedMessage.split(" ");
    const lookup = Object.fromEntries(Object.entries(codebook));

    const decodedWords = words.map((word) => {
      const decodedWord = lookup[word] || word;
      console.log(`Decoding word '${word}' to '${decodedWord}'`);
      return decodedWord;
    });

    return decodedWords.join(" ");
  }

  const codebook = {
    "the": "apple",
    "of": "banana",
    "and": "cherry",
    "to": "date",
    "a": "elderberry",
    "in": "fig",
    "is": "grape",
    "it": "honeydew",
    "that": "kiwi",
    "for": "lemon",
    "with": "lime",
    "as": "mango",
    "on": "nectarine",
    "by": "olive",
    "at": "papaya",
    "or": "quince",
    "have": "raspberry",
    "from": "strawberry",
    "this": "tangerine",
    "be": "watermelon",
    "which": "xigua",
    "one": "yellow melon",
    "you": "zucchini",
  };
  const codebook2 = {
    "apple": "the",
    "banana": "of",
    "cherry": "and",
    "date": "to",
    "elderberry": "a",
    "fig": "in",
    "grape": "is",
    "honeydew": "it",
    "kiwi": "that",
    "lemon": "for",
    "lime": "with",
    "mango": "as",
    "nectarine": "on",
    "olive": "by",
    "papaya": "at",
    "quince": "or",
    "raspberry": "have",
    "strawberry": "from",
    "tangerine": "this",
    "watermelon": "be",
    "xigua": "which",
    "yellow": "one",
    "zucchini": "you",
  };

  function modInverse(a, m) {
    a = a % m;
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1){
        console.log("x ="+x);
        return x
      };
    }
    return undefined; // Return undefined instead of throwing an error for easier handling
  }

  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  // Validate the key
  function isValidKey(a, m) {
    return a > 0 && a < m && gcd(a, m) === 1;
  }

  const handleDecryptClick = (msg, method) => {
    console.log(
      "Decrypt button clicked for message:",
      msg.id,
      "with method:",
      method
    );
    if (method === "Show original") {
      setDecryptedMessages((prev) => ({
        ...prev,
        [msg.id]: msg.messageText, // Set the decrypted message to the original message
      }));
    } else {
      const decrypted = decryptMessage(msg.messageText, method);
      setDecryptedMessages((prev) => ({
        ...prev,
        [msg.id]: decrypted,
      }));
    }
    setActiveMenuId(null); // Close the menu after decryption
  };

  const toggleMessageMenu = (msgId) => {
    console.log("Toggling menu for message:", msgId);
    setActiveMenuId((prev) => (prev === msgId ? null : msgId));
    console.log("Current active menu ID:", activeMenuId);
  };

  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {sortedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative p-2 ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              style={{
                maxWidth: "40%",
                width: "fit-content",
                wordWrap: "break-word",
                borderRadius: "10px",
                margin: "10px",
              }}
            >
              {decryptedMessages[msg.id] || msg.messageText}
              {msg.senderId !== currentUserId && (
                <button
                  onClick={() => toggleMessageMenu(msg.id)}
                  className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                  style={{ fontSize: "0.8em" }}
                >
                  <FaEllipsisV />
                </button>
              )}
              {msg.id === activeMenuId && (
                <div className="absolute bg-gray-800 border-none shadow-md z-10 -right-40 top-full mt-1 w-32 rounded-md">
                  <ul className="text-white">
                    {[
                      "Mirroring",
                      "Caesar",
                      "Affine",
                      "Shift",
                      "Steganography",
                      "Show Original",
                    ].map((method) => (
                      <li
                        key={method}
                        className="py-1 px-2 cursor-pointer hover:bg-gray-700"
                        onClick={() => handleDecryptClick(msg, method)}
                      >
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center p-2 border-t border-gray-200 dark:border-gray-800 relative"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow p-2 rounded-l-md focus:outline-none bg-gray-100 dark:bg-gray-700 dark:text-white"
        />
        <div className="relative">
          <button
            type="button"
            onClick={toggleEncryptionMethods}
            className="p-3 bg-gray-100 dark:bg-gray-700 h-full"
          >
            <FaLock className="text-white" />
          </button>
          {showEncryptionMethods && (
            <div className="absolute bg-gray-800 border-none shadow-md z-10 right-0 bottom-full mb-2">
              <div
                className="py-1 px-2 cursor-pointer transition ease-in-out hover:bg-gray-700 text-white hover:text-gray-200"
                onClick={() => selectEncryptionMethod("Mirroring")}
              >
                Mirroring
              </div>
              <div
                className="py-1 px-2 cursor-pointer transition ease-in-out hover:bg-gray-700 text-white hover:text-gray-200"
                onClick={() => selectEncryptionMethod("Caesar")}
              >
                Caesar
              </div>
              <div
                className="py-1 px-2 cursor-pointer transition ease-in-out hover:bg-gray-700 text-white hover:text-gray-200"
                onClick={() => selectEncryptionMethod("Affine")}
              >
                Affine
              </div>
              <div
                className="py-1 px-2 cursor-pointer transition ease-in-out hover:bg-gray-700 text-white hover:text-gray-200"
                onClick={() => selectEncryptionMethod("Shift")}
              >
                Shift
              </div>
              <div
                className="py-1 px-2 cursor-pointer transition ease-in-out hover:bg-gray-700 text-white hover:text-gray-200"
                onClick={() => selectEncryptionMethod("Steganography")}
              >
                Steganography
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-400/40 w-[1px] h-full" />
        <button
          type="submit"
          className="p-2 bg-gray-100 dark:bg-gray-700 text-white rounded-r-md h-full"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

MessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default MessagesList;
