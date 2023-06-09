import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Signup from "./components/Signup";
import Winedetails from "./components/Winedetails";
import { WineCellar } from "./components/Winecellar";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session", {}).then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/winecellar"
            element={
              user ? (
                <WineCellar user={user} setUser={setUser} />
              ) : (
                <div>Not Logged in. Please Login/Signup.</div>
              )
            }
          />
          <Route
            path="winecellar/:id"
            element={<Winedetails user={user} setUser={setUser} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
