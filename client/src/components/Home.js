import React from "react";
import Featured from "./Featured";
import LabelMaker from "./LabelMaker";

function Home() {
  return (
    <>
      <div className="relative bg-zinc-200 w-full h-screen">
        <div className="absolute top-0 left-0 m-5">
          <img src="" alt="Logo" className="inline-block h-10 w-auto" />
          <span className="text-lg font-bold m1-2">WineAI</span>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <h6 className="text-xs font-semibold uppercase tracking-wider mb-1 text-center">
            Welcome You Alcoholic
          </h6>
          <h1 className="text-8xl font-bold text-center wineai-heading">
            WineAI
          </h1>
        </div>
      </div>
      <Featured />
      <LabelMaker />
    </>
  );
}

export default Home;
