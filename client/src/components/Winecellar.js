import React, { useState, useEffect } from "react";
import { Winecard } from "./Winecard";
import "../Winecellar.css";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router-dom";
import WineDetails from "./Winedetails";
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

export const WineCellar = ({ user, setUser }) => {
  console.log("User object in parent component:", user);

  const [wines, setWines] = useState([]);
  const [filteredWines, setFilteredWines] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleWineDelete = (deletedWineId) => {
    const newWines = wines.filter((wine) => wine.id !== deletedWineId);
    setWines(newWines);
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const wineData = await fetchWines(user.id);
        setWines(wineData);
        setFilteredWines(wineData);
      }
    })();
  }, [user]);

  const filterWines = (type) => {
    setSelectedType(type);

    if (type === "All") {
      setFilteredWines(wines);
    } else {
      const filtered = wines.filter(
        (wine) => wine.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredWines(filtered);
    }
  };

  useEffect(() => {
    let filtered = wines;

    if (selectedType !== "All") {
      filtered = filtered.filter(
        (wine) => wine.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (wine) =>
          wine.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          wine.region.toLowerCase().includes(lowerCaseSearchTerm) ||
          wine.country.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredWines(filtered);
  }, [wines, selectedType, searchTerm]);

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="winecellar bg-zinc-200 w-full min-h-screen flex flex-col items-center">
      <h1 className="text-7xl font-bold text-center wineai-heading pb-8">
        {user.name}'s Cellar
      </h1>

      <div className="mb-4 font-mono">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <input
            type="search"
            className="relative m-0 block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search by Name, Region or Country"
            aria-label="Search"
            aria-describedby="button-addon2"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        {["White", "Red", "Orange", "All"].map((type) => (
          <button
            key={type}
            className={`pb-5 sort-button ${
              selectedType === type ? "bg-red-100" : "hover:bg-red-100"
            }`}
            onClick={() => filterWines(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="winecellar__grid">
              {filteredWines.map((wine) => (
                <Winecard
                  key={wine.id}
                  wine={wine}
                  onSelect={handleWineDelete}
                />
              ))}
            </div>
          }
        />
        <Route
          path="/winecellar/:id"
          element={<WineDetails user={user} setUser={setUser} />}
        />
      </Routes>
    </div>
  );
};
