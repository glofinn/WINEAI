import React from "react";
import Featured from "./Featured";
import LabelMaker from "./LabelMaker";
import Navbar from "./Navbar";
// import titlelogo from "../WINESRCS/titlelogo.svg";
import Winedrawing from "../WINESRCS/winedrawing.svg";
import "../App.css";

function Home({ user, setUser }) {
  return (
    <>
      <Navbar user={user} setUser={setUser} style={{ zIndex: 100 }} />
      <div className="home-featured-container">
        <div className="flex items-center justify-center bg-zinc-200 w-full h-screen">
          <div className="flex flex-col items-center justify-center">
            <h6 className="text-xs font-semibold uppercase tracking-wider mb-1 text-center">
              Welcome You Alcoholic
            </h6>
            <h1 className="text-8xl font-bold text-center wineaititle-heading">
              <img
                src={Winedrawing}
                alt="Background SVG"
                className="w-full h-full inset-0 z-0 mr-4"
              />
              WineAI
            </h1>
          </div>
        </div>
        <Featured />
      </div>
      <div className="label-maker-container">
        <LabelMaker user={user} />
      </div>
    </>
  );
}

export default Home;
