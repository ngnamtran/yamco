import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{ width: "250px", height: "100vh", backgroundColor: "#f1f1f1", padding: "1rem" }}>
      <h3>Sidebar</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/chat">Chat</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
