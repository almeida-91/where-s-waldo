import React, { useEffect } from "react";
import waldo1 from "./images/waldo1.webp";
import characters from "./images/characters.webp";
import { useState } from "react";
import "./waldo.css";

const Waldo = () => {
  const [posX, setposX] = useState();
  const [posY, setposY] = useState(0);
  const [isActive, setisActive] = useState(false);

  const mouseCursor = {
    left: posX + "px",
    top: posY + "px",
  };

  function submitAnswer(e) {
    e.preventDefault();
  }

  function handleMove(e) {
    let currentImage = document.getElementById("wally1");
    document.getElementById("popup").classList.remove("showPopUp");
    setposX(e.pageX - currentImage.offsetLeft + currentImage.scrollLeft);
    setposY(e.pageY - currentImage.offsetTop + currentImage.scrollTop);
  }

  const handleClick = (e) => {
    isActive ? setisActive(false) : setisActive(true);
    document.getElementById("popup").classList.add("showPopUp");
    console.log(posX, posY);
    console.log(isActive);
  };

  const Image = (
    <img
      id="wally1"
      src={waldo1}
      alt="Where's Waldo game"
      onMouseMove={handleMove}
      onClick={handleClick}
    />
  );

  const popup = (
    <div style={mouseCursor} id="popup" className="userClick">
      <form>
        <input type={"text"} />
        <button type="submit" onClick={submitAnswer}>
          Submit
        </button>
      </form>
    </div>
  );

  useEffect(() => {}, [posX, posY, isActive]);

  return (
    <div>
      <p>Find the following characters in the picture:</p>
      <img src={characters} alt="Characters" />
      <div>
        X: {posX} Y: {posY}
      </div>
      {Image}
      {popup}
    </div>
  );
};

export default Waldo;
