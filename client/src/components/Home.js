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
              {user
                ? `Welcome back ${user.name}!`
                : `Welcome! Please Login/Signup`}
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
        <h1 className="text-8xl font-bold text-center bg-zinc-200 w-full pt-5 pb-5">
          Featured Labels
        </h1>
        <div className="bg-zinc-200 w-full h-screen justify-center">
          {/* <h2 className="featured-title font-mono text-center justify-center ">
            Browse Random Designs
          </h2> */}
          <Featured />
        </div>
      </div>
      <h1 className="text-8xl font-bold text-center pt-20 bg-zinc-200">
        LabelMaker
      </h1>
      <div className="label-maker-container bg-zinc-200">
        <LabelMaker user={user} />
      </div>
    </>
  );
}

export default Home;
