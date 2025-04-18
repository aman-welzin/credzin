import React from "react";
import sampleImage from "../Images/pexels-ivan-samkov-7621136.jpg";

const Hello = () => {
  return (
    <div className="w-full h-[530px]">
      <img
        src={sampleImage}
        alt="Full Page"
        className="w-full h-[530px] object-cover"
      />
    </div>
  );
};

export default Hello;
