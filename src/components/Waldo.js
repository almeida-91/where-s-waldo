import React from "react";
import waldo1 from "./images/waldo1.webp";
import characters from "./images/characters.webp";

const Waldo = () => {
  return (
    <div>
      <p>Find the following characters in the picture:</p>
      <img src={characters} alt="Characters" />
      <img src={waldo1} alt="Where's Waldo game" />
    </div>
  );
};

export default Waldo;
