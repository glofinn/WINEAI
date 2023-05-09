import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Winecard.css";

export const Winecard = ({ wine, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleClick = () => {
    navigate(`/winecellar/${wine.id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/winecellar/${wine.id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        onSelect(wine.id);
      }
    } catch (error) {
      console.error("Error deleting wine", error);
    }
  };

  return (
    <div className={`winecard ${isFlipped ? "flipped" : ""}`}>
      <div
        className="winecard__front bg-zinc-200 rounded shadow-bold p-4 hover:bg-red-100 transition-all duration-300 transform hover:scale-105"
        onClick={handleClick}
      >
        <img
          src={wine.bottle}
          alt={`${wine.name} bottle`}
          className="winecard__image"
        />
        <div className="winecard__content">
          <div className="winecard__info">
            <h3 className="winecard__name  text-xl font-bold font-mono">
              {wine.name}
            </h3>
            <p className="winecard__type  font-medium font-mono">
              Type: {wine.type}
            </p>
            <p className="winecard__grapes  font-medium font-mono">
              Grapes: {wine.grapes}
            </p>
            <p className="winecard__region  font-medium font-mono">
              {wine.region}, {wine.country}
            </p>
            <p className="winecard__vintage  font-medium">{wine.vintage}</p>
          </div>
          <div className="winecard__buttons">
            <button
              className="winecard__flip-btn font-mono"
              onClick={(e) => {
                e.stopPropagation();
                handleFlipClick();
              }}
            >
              Read Story
            </button>
            <button
              className="winecard__delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Drink
            </button>
          </div>
        </div>
      </div>
      <div className="winecard__back bg-red-100">
        <p className="winecard__story font-semibold">{wine.story}</p>
        <button
          className="winecard__flip-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleFlipClick();
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
