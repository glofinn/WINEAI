import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../WINESRCS/titlelogo.svg";
import "../App.css";

function LoginSignup() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <div className="Navbar fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="flex justify-between items-center h-16 mx-8">
        <div
          className="flex items-center logo-container"
          onClick={handleHomeClick}
        >
          <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
          <h1 className="text-lg font-bold text-gray-700">WineAI</h1>
        </div>
        <div>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded mr-4"
            onClick={handleLoginClick}
          >
            Login
          </button>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded"
            onClick={handleSignupClick}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
