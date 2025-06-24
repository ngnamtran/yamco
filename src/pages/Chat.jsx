import { useState, useEffect, useRef } from "react";
import { db } from "../firebase.js"; // Firestore db
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; // Firestore methods

function Chat({ displayName }) {
  const [inputMessages, setInputMessages] = useState("");
  const [messages, setMessages] = useState([]);
  const input = useRef();

  useEffect(() => {
    // Set up real-time listener for the 'messages' collection, ordered by timestamp
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const getMsg = [];
      snapshot.forEach((doc) => {
        getMsg.push({ id: doc.id, ...doc.data() });
      });
      setMessages(getMsg);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const handleSendMessage = async () => {
    if (inputMessages.trim() === "") return; // Prevent empty messages

    try {
      await addDoc(collection(db, "messages"), {
        displayName: displayName || "Anonymous", // Match the prop name
        message: inputMessages,
        timestamp: new Date().toISOString(), // Add timestamp for ordering
      });
      setInputMessages("");
      input.current.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Chat page {displayName || "Guest"}</h1>
      <ul>
        {messages.map((mess) => (
          <li key={mess.id}>
            <span>{mess.displayName || "Anonymous"}:</span> {/* Match data structure */}
            <span>{mess.message}</span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputMessages}
        onChange={(e) => setInputMessages(e.target.value)}
        placeholder="Type your message here"
        ref={input}
      />
      <button onClick={handleSendMessage} className="btn btn-primary ms-2">
        Send
      </button>
    </div>
  );
}

export default Chat;