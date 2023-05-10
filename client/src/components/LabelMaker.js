import React, { useState, useEffect, useRef } from "react";
import wineBottle from "../WINESRCS/winebottlesmaller.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "nprogress/nprogress.css";
import spinningbottle from "../WINESRCS/titlelogo2.svg";
// import "../images.css";
import "../App.css";

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
    numImages: 1,
  });

  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedImageIds, setGeneratedImageIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
  const generateImages = async (style, numImages) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: `A detailed lithograph by Aurelien Lefort showcasing an ${style} style natural wine label with esoteric and mystic imagery.`,
          n: parseInt(numImages),
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          timeout: 60000,
        }
      );
      setGeneratedImages(response.data.data);
      setIsLoading(false);
      alert("Label Created! Pick your label and create your wine.");
      return response.data.data;
    } catch (error) {
      console.error("Error generating images:", error.response);
      setIsLoading(false);
      alert("Error generating images. Please try again.");
    }
  };

  const generateStory = async (
    name,
    type,
    grapes,
    region,
    country,
    vintage,
    user,
    style
  ) => {
    setIsLoading(true);
    const prompt = `Write me an intriguing 50-100 word story about a mythical/legendary/mysterious winemaker named ${user.name}and their renown wine dubbed ${name}, which is a ${type}, crafted in ${region}, ${country}, made with the finest organic ${grapes} grapes. The grapes were harvested in ${vintage}. Aditionally ${user.name} worked closely with mysterious and ambiguous artisans and artists to create a specially designed label in a ${style} style. Dont repeat too many of the same adjective/words. And dont start with "legend has it".`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );
    const story = response.data.choices[0].message.content;
    setIsLoading(false);

    return story;
  };

  //WINE SUBMIT FORM
  const handleSubmitWine = async (e) => {
    e.preventDefault();

    const style = formData.style;

    const story = await generateStory(
      formData.name,
      formData.type,
      formData.grapes,
      formData.region,
      formData.country,
      formData.vintage,
      user,
      style
    );

    const wineData = {
      name: formData.name,
      type: formData.type,
      grapes: formData.grapes,
      region: formData.region,
      country: formData.country,
      bottle: selectedImage,
      story: story,
      vintage: formData.vintage,
      label_id: formData.label_id || null,
      user_id: user.id,
    };

    try {
      console.log("Wine data before submission", wineData);
      const response = await axios.post("/winecellar", wineData);

      if (response.status === 201) {
        console.log("New wine created:", response.data);
        alert("Wine Created! Check your cellar.");
        setErrorMessage("");
        navigate("/winecellar");
      } else if (response.status === 400) {
        // Validation error
        setErrorMessage(response.data.message);
        console.error("Error creating new wine:", response.data);
      }
    } catch (error) {
      console.error("Error creating new wine:", error.response.data);
      setErrorMessage("An error occurred while submitting the form.");
    }
  };

  //LABLE SUBMIT
  const handleSubmitLabel = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await generateImages(
        formData.labelPrompt,
        formData.numImages
      );
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
    setFormData({ ...formData, [name]: value });
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

  // const handleSave = async () => {
  //   console.log("API Key:", process.env.REACT_APP_AWS_ACCESS_KEY_ID);
  //   console.log("Secret:", process.env.REACT_APP_AWS_SECRET_ACCESS_KEY);
  //   console.log("Region:", process.env.REACT_APP_AWS_REGION);
  //   console.log("Bucket:", process.env.REACT_APP_AWS_S3_BUCKET);
  //   const corsProxy = "https://cors-anywhere.herokuapp.com/";
  //   if (!selectedImage) return;

  //   try {
  //     // convert image to blob
  //     console.log(selectedImage);
  //     const response = await fetch(corsProxy + selectedImage);
  //     console.log(response);
  //     const blob = await response.blob();
  //     const new_image = new File([blob], "test.png");
  //     console.log(new_image);

  //     //upload blob to aws -> returns url
  //     const params = {
  //       Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
  //       // Key: `${user.id}/${Date.now()}.png`,
  //       Key: "test.png",
  //       Body: new_image,
  //       ContentType: "image/png",
  //       ACL: "FULL_CONTROL",
  //     };

  //     const uploadResult = await s3.upload(params).promise();
  //     console.log(uploadResult);
  //     const imageUrl = uploadResult.Location;

  //     const responseLabels = await axios.post("/labels", {
  //       image_url: imageUrl,
  //       style: formData.labelPrompt,
  //       user_id: user.id,
  //     });

  //     if (responseLabels.status === 201) {
  //       console.log("New label created:", responseLabels);
  //       setSelectedImage(null);
  //       setFormData({
  //         generatedimg: "",
  //         style: "",
  //         labelPrompt: "",
  //       });
  //     } else {
  //       console.error("Error creating new label:", responseLabels);
  //     }
  //   } catch (error) {
  //     console.error("Error creating new label:", error.response);
  //   }
  // };

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
    <div className="container">
      {isLoading && (
        <div className="loading-overlay">
          <img src={spinningbottle} alt="Loading..." className="spinning-svg" />
        </div>
      )}

      <div className="relative w-full min-h-screen flex items-center justify-center z-10">
        <button
          className="oval-button-cellar font-mono font-medium hover:bg-red-100 z-50"
          onClick={() => {
            navigate("/winecellar");
          }}
        >
          To Your Cellar
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
                    image.url === selectedImage ? "border-4 border-red-100" : ""
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
              <div className="selected-image-container absolute transform translate-x-[-23vh] translate-y-[23vh] image-fit ">
                <img
                  src={selectedImage}
                  alt="Selected Label"
                  className="h-full object-contain transform scale-55 max-w-[86vh] max-h-full"
                  style={{
                    position: "absolute",
                    top: "0%",
                    left: "0%",
                    clipPath: "polygon(8% 0, 92% 0, 90% 95%, 9% 100%)",
                  }}
                />
              </div>
            )}
            <img
              src={wineBottle}
              alt="Wine Bottle"
              className="h-full object-contain z-10 wine-bottle-svg"
            />
          </div>
          <div className="transform translate-x-20 w-3/5 h-5/6 px-8 py-8 z-0 float-right mr-8">
            <div className="w-full max-w-xl ml-auto mx-auto">
              <form
                className="w-full h-full bg-custom-gray border-8 border-custom-black p-6 text-black mb-8 font-mono"
                onSubmit={handleSubmitLabel}
                xw
              >
                <h2 className="text-2xl font-bold text-center text-black mb-8">
                  Create A Label
                </h2>

                <div className="mb-4">
                  <label
                    className="block text-black text-sm font-bold mb-2"
                    htmlFor="numImages"
                  >
                    Number of Images:
                  </label>
                  <select
                    className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                    id="numImages"
                    type="number"
                    name="numImages"
                    value={formData.numImages}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>

                  <label
                    className="block text-black text-sm font-bold mb-2 pt-2"
                    htmlFor="labelPrompt"
                  >
                    Art Style:
                  </label>
                  <select
                    className="shadow appearance-none rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-rectangle-gray"
                    id="labelPrompt"
                    name="labelPrompt"
                    value={formData.labelPrompt}
                    onChange={handleChange}
                  >
                    <option value="">Select a style</option>
                    <option value="Expressionist">Expressionist</option>
                    <option value="Water-Color">Water-Color</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Surreal">Surreal</option>
                    <option value="Soviet-Propoganda">Soviet Propoganda</option>
                    <option value="Art-Nouveau">Art-Nouveau</option>
                    <option value="Impressionist">Impressionist</option>
                    <option value="Fauvist">Fauvist</option>
                    <option value="Constructivist">Constructivist</option>
                  </select>
                </div>
                <div className="flex items-center justify-center">
                  <button
                    className="bg-rectangle-gray hover:scale-105 text-black font-mediun py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-red-100"
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
                    type="number"
                    name="vintage"
                    value={formData.vintage}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center justify-center">
                  {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    className="bg-rectangle-gray hover:scale-105 hover:bg-red-100 text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
    </div>
  );
}

export default LabelMaker;
