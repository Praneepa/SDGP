import React from "react";
import "./../../css/adminNav.css"; // Importing CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing FontAwesomeIcon component
import {
  faFolder,
  faPlus,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons"; // Importing FontAwesome icons

const Navbar = ({ setActiveTab, isSuperAdmin }) => {
  // Function to handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Call setActiveTab function from props to change active tab
  };

  // Function to handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("currentUser"); // Remove currentUser from localStorage
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="navbar-container"> {/* Container for the navbar */}
      <a href="/home">
        <img
          src={require("../../assets/strider_logo.png")} // Using image source from assets folder
          alt="Small Image"
          className="small-image" // Class for styling the image
        />
      </a>

      <div className="nav-items"> {/* Container for navigation items */}
        {/* Navigation item for Projects */}
        <div className="nav-item" onClick={() => handleTabClick("current")}>
          <FontAwesomeIcon icon={faFolder} className="nav-icon" /> {/* Icon for Projects */}
          <p>Projects</p> {/* Label for Projects */}
        </div>
        {/* Navigation item for Profile */}
        <div className="nav-item" onClick={() => handleTabClick("profile")}>
          <FontAwesomeIcon icon={faUser} className="nav-icon" /> {/* Icon for Profile */}
          <p>Profile</p> {/* Label for Profile */}
        </div>
        {/* Navigation item for Sign Out */}
        <div className="nav-item" onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" /> {/* Icon for Sign Out */}
          <p>Sign Out</p> {/* Label for Sign Out */}
        </div>
      </div>
    </div>
  );
};

export default Navbar; // Exporting Navbar component
