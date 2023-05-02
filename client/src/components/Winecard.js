import React, { useState } from "react";
import "../Winecard.css";

export const Winecard = ({ wine, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`winecard ${isFlipped ? "flipped" : ""}`}>
      <div className="winecard__front">
        <img
          src={wine.bottle}
          alt={`${wine.name} bottle`}
          className="winecard__image"
        />
        <div className="winecard__content">
          <h3 className="winecard__name">{wine.name}</h3>
          <p className="winecard__type">Type: {wine.type}</p>
          <p className="winecard__grapes">Grapes: {wine.grapes}</p>
          <p className="winecard__region">
            {wine.region}, {wine.country}
          </p>
          <button className="winecard__flip-btn" onClick={handleClick}>
            Read Story
          </button>
        </div>
      </div>
      <div className="winecard__back">
        <p className="winecard__story">{wine.story}</p>
        <button className="winecard__flip-btn" onClick={handleClick}>
          Go Back
        </button>
      </div>
    </div>
  );
};
