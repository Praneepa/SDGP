import React, { useState } from "react";
import Navbar from "../user/Navbar"; // Importing Navbar component
import Projects from "../../components/user/Projects"; // Importing Projects component
import Profile from "../../components/user/Profile"; // Importing Profile component
import SignOut from "../../components/admin/SignOut"; // Importing SignOut component
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from react-router-dom
import "../../css/terminal.css"; // Importing CSS file for styling

function Home() {
  const navigate = useNavigate(); // Initializing navigate function using useNavigate hook from react-router-dom
  const [activeTab, setActiveTab] = useState("current"); // Initializing state variable activeTab with initial value "current"

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab); // Set activeTab state to the selected tab
  };

  return (
    <div className="navbar-tutors-container"> {/* Container for Navbar and content */}
      <Navbar setActiveTab={handleTabChange} /> {/* Navbar component with prop setActiveTab */}
      <div className="tutors-profile-container"> {/* Container for profile content */}
        {activeTab === "current" && <Projects />} {/* Render Projects component if activeTab is "current" */}
        {activeTab === "profile" && <Profile />} {/* Render Profile component if activeTab is "profile" */}
        {activeTab === "signout" && <SignOut />} {/* Render SignOut component if activeTab is "signout" */}
      </div>
    </div>
  );
}

export default Home; // Exporting Home component
