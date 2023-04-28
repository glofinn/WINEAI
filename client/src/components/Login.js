import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: formData["username"],
      password_hash: formData["password"],
    };
    fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(() => {
      navigate("/home");
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
    <div className="bg-gray-200 min-h-screen flex flex-col justify-center items-center">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8">Login to WineAI</h1>
      <form
        className="bg-custom-gray p-8 rounded-md shadow-md max-w-lg w-full mx-auto border-8 border-custom-black p-6 text-black"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-black font-bold mb-2">
            Enter your username
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
            Enter your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="block w-full p-2 border rounded-md border-gray-500 bg-rectangle-gray"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="bg-gray-700 text-white py-2 px-4 rounded font-bold"
        >
          Login
        </button>
      </form>
      <div className="fixed top-0 left-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"></div>
      <div className="fixed top-0 right-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"></div>
    </div>
  );
}

export default Login;
