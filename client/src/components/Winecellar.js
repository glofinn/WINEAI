import React, { useState, useEffect } from "react";
import { Winecard } from "./Winecard";
import "../Winecellar.css";
import Navbar from "./Navbar";

const fetchWines = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:5555/winecellar?user_id=${userId}`,
      { mode: "cors" }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wine data:", error);
  }
  return [];
};

export const WineCellar = ({ user }) => {
  const [wines, setWines] = useState([]);

  useEffect(() => {
    (async () => {
      if (user) {
        const wineData = await fetchWines(user.id);
        setWines(wineData);
      }
    })();
  }, [user]);

  return (
    <div className="winecellar relative bg-zinc-200 w-full min-h-screen">
      <h1 className="text-7xl font-bold text-center wineai-heading">
        {user.name}'s Wine Cellar
      </h1>
      <Navbar user={user} />
      <div className="winecellar__grid">
        {wines.map((wine) => (
          <Winecard key={wine.id} wine={wine} />
        ))}
      </div>
    </div>
  );
};
