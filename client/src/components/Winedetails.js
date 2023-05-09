import React, { useEffect, useState } from "react";
import "../Winedetails.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Emptybottle from "../WINESRCS/emptybottle.svg";
import NProgress from "nprogress";
import axios from "axios";
import spinningbottle from "../WINESRCS/titlelogo2.svg";

const WineDetails = ({ onClose, user, setUser }) => {
  console.log("User object:", user);

  const [wine, setWine] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWine = async () => {
      try {
        const response = await fetch(`/winecellar/${id}`);
        const data = await response.json();
        setWine(data);
      } catch (error) {
        console.error("Error fetching wine data:", error);
      }
    };

    fetchWine();
  }, [id]);

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
    const prompt = `Write me an intriguing 50-100 word story about a mythical/legendary/mysterious winemaker named ${user.name}and their renown wine dubbed ${name}, which is a ${type}, crafted in ${region}, ${country}, made with the finest organic ${grapes} grapes. The grapes were harvested in ${vintage}. Aditionally ${user.name} worked closely with mysterious and ambiguous artisans and artists to create a specially designed. Dont repeat too many of the same adjective/words and dont start with "legend has it".`;

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
    alert("Wine Updated! Check your cellar.");

    return story;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, bottle: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateStory = async (wineId, story) => {
    try {
      const response = await fetch(`/winecellar/${wineId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story }),
      });
      if (!response.ok) {
        console.error("Error updating wine story", response.statusText);
      }
    } catch (error) {
      console.error("Error updatin wine story:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowEditForm(false);
    if (!user) {
      console.error("User not defined");
      return;
    }
    try {
      const response = await fetch(`/winecellar/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedWine = await response.json();
        const story = await generateStory(
          updatedWine.name,
          updatedWine.type,
          updatedWine.grapes,
          updatedWine.region,
          updatedWine.country,
          updatedWine.vintage,
          user,
          updatedWine.style
        );
        await updateStory(id, story);
        setWine({ ...updatedWine, story });
      } else {
        console.error("Error updating wine:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating wine:", error);
    }
  };

  if (!wine) {
    return <div>No Wines Available. Please create some. </div>;
  }

  return (
    <div className="wine-details w-full h-screen bg-zinc-200">
      {isLoading && (
        <div className="loading-overlay">
          <img src={spinningbottle} alt="Loading..." className="spinning-svg" />
        </div>
      )}
      <Navbar user={user} setUser={setUser} />
      {showEditForm && (
        <>
          <div className="form-background"></div>
          <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="edit-form ">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={wine.name}
                onChange={handleInputChange}
              />

              <label htmlFor="type">Type:</label>
              <input
                type="text"
                id="type"
                name="type"
                defaultValue={wine.type}
                onChange={handleInputChange}
              />

              <label htmlFor="region">Region:</label>
              <input
                type="text"
                id="region"
                name="region"
                defaultValue={wine.region}
                onChange={handleInputChange}
              />

              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                defaultValue={wine.country}
                onChange={handleInputChange}
              />

              <label htmlFor="grapes">Grapes:</label>
              <input
                type="text"
                id="grapes"
                name="grapes"
                defaultValue={wine.grapes}
                onChange={handleInputChange}
              />

              <label htmlFor="bottle">Bottle:</label>
              <input
                type="file"
                id="bottle"
                name="bottle"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setShowEditForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}
      <div className="wine-details__left">
        <h2 className="wine-title font-mono font-bold">{wine.name}</h2>
        <p className="font-mono font-medium">Type: {wine.type}</p>
        <p className="font-mono font-medium">Grapes: {wine.grapes}</p>
        <p className="font-mono font-medium">
          Conceived: {wine.region}, {wine.country}
        </p>
        <p className="font-mono font-medium">Vintage: {wine.vintage}</p>
      </div>
      <div className="wine-details__center font-mono">
        <img
          src={wine.bottle}
          alt={`${wine.name} bottle`}
          className="wine-bottle"
        />
        <img src={Emptybottle} className="emptybottle" alt="Blank bottle"></img>
      </div>
      <div className="wine-details__right">
        <p className="wine-details__story font-mono">{wine.story}</p>
      </div>
      <button
        className="oval-button font-mono hover:bg-red-100"
        onClick={() => {
          navigate("/winecellar");
        }}
        style={{ zIndex: 1000 }}
      >
        Back
      </button>
      <div
        className="fixed top-0 left-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"
        style={{ zIndex: "0" }}
      ></div>
      <div
        className="fixed top-0 right-0 w-1/4 h-full bg-rectangle-gray opacity-50 z-0"
        style={{ zIndex: "0" }}
      ></div>
      <button
        className="oval-button-edit font-mono hover:bg-red-100"
        onClick={() => setShowEditForm(true)}
        style={{ zIndex: 1000 }}
      >
        Edit
      </button>
    </div>
  );
};

export default WineDetails;
