import React, { useState, useEffect, useRef } from "react";
import wineBottle from "../WINESRCS/winebottlesmaller.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import AWS from "aws-sdk";

const fetchRecentLabels = async (userId) => {
  try {
    const response = await axios.get(`/labels/user/${userId}`);
    return response.data.labels;
  } catch (error) {
    console.error("Error fetching recent labels:", error);
    return [];
  }
};

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

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

  //REQUEST TO DALL-E
  const generateImages = async (style) => {
    NProgress.start();
    // console.log("API Key:", process.env.REACT_APP_OPENAI_API_KEY);

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: `A detailed lithograph by Aurelien Lefort showcasing an ${style} style natural wine label with esoteric and mystic imagery.`,
        n: 1,
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
    NProgress.done();
    return response.data.data;
  };

  //WINE SUBMIT FORM
  const handleSubmitWine = async (e) => {
    e.preventDefault();
    const wineData = {
      name: formData.name,
      type: formData.type,
      grapes: formData.grapes,
      region: formData.region,
      country: formData.country,
      bottle: selectedImage,
      vintage: formData.vintage,
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

  //LABLE SUBMIT
  const handleSubmitLabel = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await generateImages(formData.labelPrompt);
      const imageIds = await saveImageUrls(
        imageUrls.map((image) => image.image.url)
      );
      setGeneratedImages([...generateImages, ...imageUrls]);
      setGeneratedImageIds([...generatedImageIds, ...imageIds]);

      if (imageIds.length > 0) {
        setFormData((prevState) => ({ ...prevState, label_id: imageIds[0] }));
      }
    } catch (error) {
      console.error("Error generating images:", error.response);
    }
  };

  //LABELCLICK
  const handleLabelClick = (id, url) => {
    console.log(selectedImage);
    setSelectedImage(url);
    setFormData((prevState) => ({ ...prevState, label_id: id }));
  };

  //SAVEURL
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
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  //WITH PROXY
  // const handleSave = async () => {
  //   if (!selectedImage) return;

  //   try {
  //     // Save the selected image URL to the proxy server
  //     const response = await axios.post("/proxy/save-image", {
  //       image_url: selectedImage,
  //       user_id: user.id,
  //     });

  //     if (response.status === 200) {
  //       console.log("Image URL saved to the proxy server:", response);
  //       setSelectedImage(null);
  //       setFormData({
  //         generatedimg: "",
  //         style: "",
  //         labelPrompt: "",
  //       });
  //     } else {
  //       console.error("Error saving image URL to the proxy server:", response);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error saving image URL to the proxy server:",
  //       error.response
  //     );
  //   }
  // };

  //WITHOUT PROXY

  const handleSave = async () => {
    console.log("API Key:", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
    console.log("Secret:", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
    console.log("Region:", process.env.REACT_APP_AWS_REGION);
    console.log("Bucket:", process.env.REACT_APP_AWS_S3_BUCKET);
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    if (!selectedImage) return;

    try {
      //convert image to blob
      console.log(selectedImage);
      const response = await fetch(corsProxy + selectedImage);
      const blob = await response.blob();

      //upload blob to aws -> returns url
      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: `${user.id}/${Date.now()}.png`,
        Body: blob,
        ContentType: "image/png",
        ACL: "public-read",
      };

      const uploadResult = await s3.upload(params).promise();
      // console.log(uploadResult);
      const imageUrl = uploadResult.Location;

      const responseLabels = await axios.post("/labels", {
        image_url: imageUrl,
        style: formData.labelPrompt,
        user_id: user.id,
      });

      if (responseLabels.status === 201) {
        console.log("New label created:", responseLabels);
        setSelectedImage(null);
        setFormData({
          generatedimg: "",
          style: "",
          labelPrompt: "",
        });
      } else {
        console.error("Error creating new label:", responseLabels);
      }
    } catch (error) {
      console.error("Error creating new label:", error.response);
    }
  };

  //WITHOUT PROXY
  // const downloadImage = async (url, filename) => {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   const a = document.createElement("a");
  //   a.href = URL.createObjectURL(blob);
  //   a.download = filename;
  //   a.click();
  //   a.remove();
  // };

  //WITH PROXY
  // const downloadImage = async (url, filename) => {
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  //       },
  //       mode: "cors",
  //     });
  //     const blob = await response.blob();
  //     fileDownload(blob, filename);
  //   } catch (error) {
  //     console.error("Error downloading image:", error);
  //   }
  // };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {selectedImage && (
        <button
          className="oval-button2 font-mono"
          onClick={handleSave}
          style={{ zIndex: 20 }}
        >
          Save Label
        </button>
      )}
      <button
        className="oval-button font-mono"
        onClick={() => {
          navigate("/winecellar");
        }}
        style={{ zIndex: 1000 }}
      >
        To The Cellar
      </button>

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="relative w-1/3 h-5/6 -ml-16">
          <div className="relative top-0 left-0 w-full h-full bg-gray-400 opacity-50 z-0"></div>
          <div className="relative top-0 left-0 w-full h-full flex justify-center items-center z-10 flex-col space-y-4 -ml-8">
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
            <div className="absolute w-auto transform translate-x-[-23vh] translate-y-[22vh]">
              <img
                src={selectedImage}
                alt="Selected Label"
                className="w-auto h-full object-contain transform scale-54 max-w-[90vh] max-h-full"
                style={{
                  clipPath: "polygon(11% 0, 87% 0, 86% 90%, 11% 100%)",
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
        <div className="transform translate-x-20 w-3/5 h-5/6 px-8 py-8 z-0 float-right mr-8">
          <div className="w-full max-w-xl ml-auto mx-auto">
            <form
              className="w-full h-full bg-custom-gray border-8 border-custom-black p-6 text-black mb-8 font-mono"
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
              className="w-full h-full bg-custom-gray border-8 border-custom-black p-6 text-black font-mono"
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
              <div className="mb-4">
                <label
                  className="block text-black text-sm font-bold mb-2"
                  htmlFor="vintage"
                >
                  Vintage
                </label>
                <input
                  className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                  id="vintage"
                  type="integer"
                  name="vintage"
                  value={formData.vintage}
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
          style={{ zIndex: "-20" }}
        ></div>
        <div
          className="fixed top-0 right-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"
          style={{ zIndex: "-20" }}
        ></div>
      </div>
    </div>
  );
}

export default LabelMaker;
