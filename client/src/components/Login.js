import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Login({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    _password_hash: "",
  });

  const [showError, setShowError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(
    location.state?.confirmationMessage || null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: formData["username"],
      _password_hash: formData["_password_hash"],
    };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Error: ${r.status} - ${r.statusText}`);
        }
        return r.json();
      })
      .then((data) => {
        setUser(data);
        navigate("/"); // Navigate only on successful login
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        setShowError("Invalid username or password");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col justify-center items-center font-mono">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8">Welcome Back To WineAI</h1>
      {showError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
          {showError}
        </div>
      )}
      {showConfirmation && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded">
          {showConfirmation}
        </div>
      )}
      <form
        className="bg-custom-gray rounded-md shadow-md max-w-lg w-full mx-auto border-8 border-custom-black p-6 text-black font-mono"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-black font-bold mb-2">
            Enter your username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="block w-full p-2 rounded-md border-gray-500 bg-rectangle-gray"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-black font-bold mb-2">
            Enter your password:
          </label>
          <input
            type="password"
            name="_password_hash"
            id="password"
            className="block w-full p-2 border rounded-md border-gray-500 bg-rectangle-gray"
            value={formData._password_hash}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="bg-rectangle-gray font-semi-bold text-text-black py-2 px-4 rounded mr-4 font-mono font-medium hover:bg-red-100"
        >
          Login
        </button>
      </form>
      <div className="fixed top-0 left-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"></div>
      <div className="fixed top-0 right-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"></div>
      <button
        className="oval-button font-mono hover:bg-red-100"
        // onClick={() => {
        //   navigate("/");
        // }}
        style={{ zIndex: 1000 }}
      >
        Back
      </button>
    </div>
  );
}

export default Login;
