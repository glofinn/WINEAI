import React, { useState, useEffect, useRef } from "react";
import "../Featured.css";

function Featured() {
  const [activeIndex, setActiveIndex] = useState(0);

  const designTypes = [
    {
      id: 1,
      title: "Design Type 1",
      images: [
        "https://via.placeholder.com/150x150/FF5733",
        "https://via.placeholder.com/150x150/FFC300",
        "https://via.placeholder.com/150x150/DAF7A6",
      ],
    },
    {
      id: 2,
      title: "Design Type 2",
      images: [
        "https://via.placeholder.com/150x150/C70039",
        "https://via.placeholder.com/150x150/900C3F",
        "https://via.placeholder.com/150x150/581845",
      ],
    },
    {
      id: 3,
      title: "Design Type 3",
      images: [
        "https://via.placeholder.com/150x150/4A235A",
        "https://via.placeholder.com/150x150/154360",
        "https://via.placeholder.com/150x150/1B4F72",
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % designTypes.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeIndex, designTypes.length]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
      <div className="flex items-center">
        <img
          src={designTypes[activeIndex].images[0]}
          alt="Left 1"
          className="absolute left-20 h-32 w-auto"
        />
        <div className="flex-col items-center">
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
        </div>
        <div className="relative ml-8 mt-4">
          <img
            src={designTypes[activeIndex].images[1]}
            alt="Right 1"
            className="absolute h-32 w-auto z-10"
          />
          <img
            src={designTypes[activeIndex].images[2]}
            alt="Right 2"
            className="absolute h-32 w-auto ml-12 mt-12 z-0"
          />
        </div>
      </div>
    </div>
  );
}

export default Featured;
