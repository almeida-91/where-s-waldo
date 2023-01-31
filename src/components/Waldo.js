import React, { useEffect } from "react";
import waldo1 from "./images/waldo1.webp";
import characters from "./images/characters.webp";
import waldo from "./images/wally.webp";
import woof from "./images/woof.webp";
import wenda from "./images/wenda.webp";
import whitebeard from "./images/whitebeard.webp";
import odlaw from "./images/odlaw.webp";
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

  const handleClick = () => {
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
        <label htmlFor="waldo">
          <p className="inputLine">
            <input type={"radio"} name="charSelect" id="waldo" />{" "}
            <img src={waldo} alt="waldo" />
            <span>Waldo</span>
          </p>
        </label>
        <label htmlFor="woof">
          <p className="inputLine">
            <input type={"radio"} name="charSelect" id="woof" />{" "}
            <img src={woof} alt="woof" />
            <span>Woof</span>
          </p>
        </label>
        <label htmlFor="wenda">
          <p className="inputLine">
            <input type={"radio"} name="charSelect" id="wenda" />{" "}
            <img src={wenda} alt="wenda" />
            <span>Wenda</span>
          </p>
        </label>
        <label htmlFor="whitebeard">
          <p className="inputLine">
            <input type={"radio"} name="charSelect" id="whitebeard" />{" "}
            <img src={whitebeard} alt="whitebeard" />
            <span>Whitebeard</span>
          </p>
        </label>
        <label htmlFor="odlaw">
          <p className="inputLine">
            <input type={"radio"} name="charSelect" id="odlaw" />{" "}
            <img src={odlaw} alt="odlaw" />
            <span>Odlaw</span>
          </p>
        </label>
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
