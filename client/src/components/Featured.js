import React, { useState, useEffect } from "react";
import "../Featured.css";

function Featured() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wines, setWines] = useState([]);

  const fetchWines = async () => {
    try {
      const response = await fetch("/winecellar");
      const data = await response.json();
      setWines(data);
    } catch (error) {
      console.error("Error fetching wines:", error);
    }
  };

  useEffect(() => {
    fetchWines();
  }, []);

  useEffect(() => {
    if (wines.length > 0) {
      const usedWines = [];
      const getRandomWine = () => {
        let randomWine;
        do {
          randomWine = wines[Math.floor(Math.random() * wines.length)].bottle;
        } while (usedWines.includes(randomWine));
        usedWines.push(randomWine);
        return randomWine;
      };
      const updatedDesignTypes = designTypes.map((designType) => ({
        ...designType,
        images: designType.images.map(() => getRandomWine()),
      }));
      setDesignTypes(updatedDesignTypes);
    }
  }, [wines]);

  const [designTypes, setDesignTypes] = useState([
    {
      id: 1,
      title: "Design Type 1",
      images: [null, null, null],
    },
    {
      id: 2,
      title: "Design Type 2",
      images: [null, null, null],
    },
    {
      id: 3,
      title: "Design Type 3",
      images: [null, null, null],
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % designTypes.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeIndex, designTypes.length]);

  // console.log("designtypes:", designTypes);
  return (
    <div className="featured-main-container">
      <div className="featured-container flex-col flex items-center justify-center">
        <img
          src={designTypes[activeIndex].images[0]}
          alt="Left 1"
          className="absolute left-20 h-64 w-auto imgstroke-1"
        />
        <div className="flex-col items-center"></div>
        <div className="relative ml-8 mt-4 right-images-container">
          <img
            src={designTypes[activeIndex].images[1]}
            alt="Right 1"
            className="h-64 w-auto bg-color-2 imgstroke-2"
          />
          <div className="flex items-center">
            {designTypes.map((designType, index) => (
              <div
                key={designType.id}
                className="flex flex-col items-center mx-2 relative"
              >
                <div className="circle-container relative mt-2">
                  <div
                    className={`cursor-pointer rounded-full h-10 w-10 border-4 border-solid ${
                      activeIndex === index
                        ? "border-gray-700 bg-gray-700"
                        : "border-transparent bg-gray-300"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    style={{ zIndex: 1 }}
                  />
                  {activeIndex === index && (
                    <div className="circular-progress-wrapper absolute inset-0">
                      <svg className="circular-progress" viewBox="0 0 36 36">
                        <path
                          className="circle-bg"
                          d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="circle"
                          d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <img
            src={designTypes[activeIndex].images[2]}
            alt="Right 2"
            className="h-64 w-auto ml-12 mt-12 imgstroke-3"
          />
        </div>
      </div>
    </div>
  );
}

export default Featured;
