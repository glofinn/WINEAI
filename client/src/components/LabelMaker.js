import React, { useState } from "react";
import wineBottle from "../WINESRCS/winebottle.svg"; // Replace this with the actual wine bottle image path

function LabelMaker() {
  const [formData, setFormData] = useState({
    name: "",
    style: "",
    grapes: "",
    year: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="relative w-1/4 h-5/6">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
            <div className="w-3/4 h-3/4 bg-white">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://via.placeholder.com/150x150/DAF7A6?text=Image+${i}`}
                  alt={`Placeholder ${i}`}
                  className={`w-full h-1/4 object-cover ${i < 4 ? "mb-2" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-5/6 flex justify-center items-center z-0">
          <img
            src={wineBottle}
            alt="Wine Bottle"
            className="h-full object-contain z-10"
          />
        </div>
        <div
          className="w-1/3 h-5/6 px-8 py-8 z-0"
          style={{ marginLeft: "auto" }}
        >
          <div className="w-full max-w-md mx-auto">
            <form className="w-full h-full bg-custom-gray border-8 border-custom-black p-6 text-black">
              <h2 className="text-2xl font-bold text-center text-black mb-8">
                Create your Label
              </h2>

              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="style"
                >
                  Style
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="style"
                  type="text"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="grapes"
                >
                  Grapes
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="grapes"
                  type="text"
                  name="grapes"
                  value={formData.grapes}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="year"
                >
                  Year
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="year"
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-rectangle-gray hover:scale-105 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className="fixed top-0 left-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"
          style={{ zIndex: "-1" }}
        ></div>
        <div
          className="fixed top-0 right-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"
          style={{ zIndex: "-1" }}
        ></div>
      </div>
    </div>
  );
}

export default LabelMaker;
