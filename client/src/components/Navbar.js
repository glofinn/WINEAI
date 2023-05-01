import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../WINESRCS/titlelogo.svg";
import "../App.css";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  async function handleLogout() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`logout failed with status: ${response.status}`);
      }

      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }

  return (
    <div className="Navbar fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="flex justify-between items-center h-16 mx-8">
        <div
          className="flex items-center logo-container"
          onClick={handleHomeClick}
        >
          <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
          <h1 className="text-lg font-semi-bold text-text-black">WineAI</h1>
        </div>
        <div>
          {user == null && (
            <button
              className="bg-rectangle-gray font-semi-bold text-text-black py-2 px-4 rounded mr-4"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
          {user && (
            <button
              className="bg-rectangle-gray font-semi-bold text-text-black py-2 px-4 rounded mr-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          {user === null && (
            <button
              className="bg-rectangle-gray font-semi-bold text-text-black py-2 px-4 rounded"
              onClick={handleSignupClick}
            >
              Signup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
