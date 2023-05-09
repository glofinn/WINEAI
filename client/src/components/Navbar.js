import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../WINESRCS/titlelogo2.svg";
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
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }

  return (
    <div className="Navbar fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="flex justify-between items-center h-16 mx-8">
        <div className="relative logo-container" onClick={handleHomeClick}>
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <h1 className="text-lg font-semi-bold text-text-black absolute left-3 top-0.5 font-mono">
            WineAI
          </h1>
        </div>
        <div>
          {user == null && (
            <button
              className="bg-rectangle-gray font-semi-bold text-text-black py-2 px-4 rounded mr-4 font-mono font-medium hover:bg-red-100"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
          {user && (
            <button
              className="bg-rectangle-gray font-semi-bold text-text-black py-2 px-4 rounded mr-4 font-mono font-medium hover:bg-red-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          {user === null && (
            <button
              className="bg-sky-800 font-semi-bold text-white py-2 px-4 rounded font-mono font-medium hover:bg-red-100"
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
