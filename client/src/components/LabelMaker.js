import React, { useState, useEffect, useRef } from "react";
import wineBottle from "../WINESRCS/winebottlesmaller.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fetchRecentLabels = async (userId) => {
  try {
    const response = await axios.get(`/labels/user/${userId}`);
    return response.data.labels;
  } catch (error) {
    console.error("Error fetching recent labels:", error);
    return [];
  }
};

function LabelMaker({ user }) {
  const [formData, setFormData] = useState({
    generatedimg: "",
    style: "",
    labelPrompt: "",
  });

  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedImageIds, setGeneratedImageIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const getRecentLabels = async () => {
        const recentLabels = await fetchRecentLabels(user.id);
        setGeneratedImages(
          recentLabels.map((label) => ({ url: label.image_url }))
        );
        setGeneratedImageIds(recentLabels.map((label) => label.id));
      };
      getRecentLabels();
    }
  }, [user]);

  const generateImages = async (style) => {
    console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY);

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: `A detailed lithograph by Aurelien Lefort showcasing an ${style} style natural wine label with esoteric and mystic imagery.`,
        n: 4,
        size: "1024x1024",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );
    setGeneratedImages(response.data.data);
    return response.data.data;
  };

  const handleSubmitWine = async (e) => {
    e.preventDefault();
    const wineData = {
      name: formData.name,
      type: formData.type,
      grapes: formData.grapes,
      region: formData.region,
      country: formData.country,
      label_id: formData.label_id || null,
      user_id: user.id,
    };
    try {
      const response = await axios.post("/winecellar", wineData);

      if (response.status === 201) {
        console.log("New wine created:", response.data);
      } else {
        console.error("Error creating new wine:", response.data);
      }
    } catch (error) {
      console.error("Error creating new wine:", error.response.data);
    }
  };

  const handleSubmitLabel = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await generateImages(formData.labelPrompt);
      const imageIds = await saveImageUrls(
        imageUrls.map((image) => image.image.url)
      );
      setGeneratedImages((prevState) => [...prevState, ...imageUrls]);
      setGeneratedImageIds((prevState) => [...prevState, ...imageIds]);
    } catch (error) {
      console.error("Error generating images:", error.response.data);
    }
  };

  //LABELCLICK
  const handleLabelClick = (id, url) => {
    console.log("hi");
    setSelectedImage(url);
    setFormData((prevState) => ({ ...prevState, label_id: id }));
  };

  const saveImageUrls = async (imageUrls) => {
    try {
      const response = await axios.post("/labels", {
        imageUrls: imageUrls,
        style: formData.labelPrompt,
        user_id: user.id,
      });
      console.log(response.data.message);
      return response.data.imageIds;
    } catch (error) {
      console.error("Error saving image URLs:", error);
      setGeneratedImageIds([]);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <button
        className="oval-button"
        onClick={() => {
          navigate("/winecellar");
        }}
      >
        Go To WineCellar
      </button>

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="relative w-1/4 h-5/6">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 flex-col space-y-4">
            {generatedImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Generated Label ${index + 1}`}
                className={`w-full object-contain ${
                  image.url === selectedImage ? "border-4 border-blue-500" : ""
                }`}
                onClick={() =>
                  handleLabelClick(generatedImageIds[index], image.url)
                }
              />
            ))}
          </div>
        </div>
        <div className="w-full h-5/6 flex justify-center items-center z-0 relative">
          {selectedImage && (
            <div className="absolute w-auto transform translate-x-[-25vh] translate-y-[23vh]">
              <img
                src={selectedImage}
                alt="Selected Label"
                className="w-auto h-full object-contain transform scale-54 max-w-[90vh] max-h-full"
                style={{
                  clipPath: "polygon(5% 0, 90% 0, 90% 100%, 10% 100%)",
                }}
              />
            </div>
          )}
          <img
            src={wineBottle}
            alt="Wine Bottle"
            className="h-full object-contain z-10"
          />
        </div>
        <div className="w-2/4 h-5/6 px-8 py-8 z-0 float-right">
          <div className="w-full max-w-md mx-auto">
            <form
              className="w-full h-full bg-custom-gray border-8 border-custom-black p-6 text-black mb-8"
              onSubmit={handleSubmitLabel}
            >
              <h2 className="text-2xl font-bold text-center text-black mb-8">
                Create Your Label
              </h2>

              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="labelPrompt"
                >
                  Label Prompt
                </label>
                <select
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="labelPrompt"
                  name="labelPrompt"
                  value={formData.labelPrompt}
                  onChange={handleChange}
                >
                  <option value="">Select a prompt</option>
                  <option value="Expressionist">Expressionist</option>
                  <option value="Water-Color">Water-Color</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Surreal">Surreal</option>
                  <option value="Soviet-Propoganda">Soviet Propoganda</option>
                </select>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-rectangle-gray hover:scale-105 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Create Label
                </button>
              </div>
            </form>
            <form
              className="w-full h-full bg-custom-gray border-8 border-custom-black p-6 text-black"
              onSubmit={handleSubmitWine}
            >
              <h2 className="text-2xl font-bold text-center text-black mb-8">
                Create Your Wine
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
                  htmlFor="type"
                >
                  Type
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="type"
                  type="text"
                  name="type"
                  value={formData.type}
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
                  htmlFor="region"
                >
                  Region
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="region"
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
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
