import React, { useEffect } from "react";

import waldo1 from "./images/waldo1.jpeg";
import waldo2 from "./images/waldo2.jpeg";
import waldo3 from "./images/waldo3.jpeg";
import waldo4 from "./images/waldo4.jpeg";
import charactersPic from "./images/characters.webp";
import waldo from "./images/wally.webp";
import woof from "./images/woof.webp";
import wenda from "./images/wenda.webp";
import whitebeard from "./images/whitebeard.webp";
import odlaw from "./images/odlaw.webp";

import { useState } from "react";
import "./waldo.css";
import { getRecords, getSolutions } from "./serverdata";

const Waldo = () => {
  const [posX, setposX] = useState(0);
  const [posY, setposY] = useState(0);
  const [isActive, setisActive] = useState(true);
  const [selectedImage, setSelectedImage] = useState(waldo1);
  const [selectedChar, setSelectedChar] = useState("");
  const imageArray = [waldo1, waldo2, waldo3, waldo4];
  const characters = ["Waldo", "Woof", "Wenda", "Whitebeard", "Odlaw"];
  const charImages = [waldo, woof, wenda, whitebeard, odlaw];
  const [selectedImageIndex, setSelectedImageIndex] = useState(1);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [initialTime, setInitialTime] = useState();
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [leaderBoard, setLeaderBoard] = useState([]);

  const [globalMousePos, setGlobalMousePos] = useState({});
  const mouseCursor = {
    left: posX + "px",
    top: posY + "px",
  };

  function handleMove(e) {
    let currentImage = document.getElementById("wally1");
    setposX(e.pageX - currentImage.offsetLeft + currentImage.scrollLeft);
    setposY(e.pageY - currentImage.offsetTop + currentImage.scrollTop);
  }

  const handleClick = (e) => {
    setClickPosition({ x: posX, y: posY });
    setGlobalMousePos({
      left: e.pageX + "px",
      top: e.pageY + "px",
    });
    setisActive(!isActive);

    if (isActive) {
      document.getElementById("popup").classList.add("showPopUp");
    } else {
      document.getElementById("popup").classList.remove("showPopUp");
    }
  };

  const imageList = imageArray.map((image, index) => (
    <img
      key={index}
      className="imagePreview"
      src={image}
      onClick={() => {
        setSelectedImage(image);
        setSelectedImageIndex(index + 1);
      }}
      alt="game preview"
    />
  ));

  const Image = (
    <img
      id="wally1"
      src={selectedImage}
      alt="Where's Waldo game"
      onMouseMove={handleMove}
      onClick={handleClick}
    />
  );

  const characterSelection = characters.map((character, index) => (
    <label htmlFor={character} key={index}>
      <p className="inputLine">
        <input
          type={"radio"}
          name="charSelect"
          id={character}
          value={character}
          onChange={(e) => {
            setSelectedChar(e.currentTarget.id.toLowerCase());
          }}
        />{" "}
        <img src={charImages[index]} alt={character} />
        <span>{character}</span>
      </p>
    </label>
  ));

  const popup = (
    <div style={globalMousePos} id="popup" className="userClick">
      <form onSubmit={submitAnswer}>
        {characterSelection}
        <button type="submit">Submit</button>
      </form>
    </div>
  );

  async function submitAnswer(e) {
    e.preventDefault();
    document.getElementById("popup").classList.remove("showPopUp");
    setisActive(true);
    const answer = await getCharacter(selectedChar, selectedImageIndex);
    const deltaX = clickPosition.x - answer.charCoordX;
    const deltaY = clickPosition.y - answer.charCoordY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < answer.charRadius) {
      console.log(`Found ${selectedChar}`);
      if (!foundCharacters.includes(selectedChar)) {
        setFoundCharacters([...foundCharacters, selectedChar]);
      }
    } else {
      console.log("nope");
    }
  }

  // Get coordinates and radius for the character we're checking
  // from the backend
  async function getCharacter(character, imageindex) {
    let answer = await getSolutions(imageindex);
    let characterCoords;
    switch (character) {
      case "waldo":
        characterCoords = {
          charCoordX: answer.waldoX,
          charCoordY: answer.waldoY,
          charRadius: answer.waldoRadius,
        };
        break;
      case "woof":
        characterCoords = {
          charCoordX: answer.woofX,
          charCoordY: answer.woofY,
          charRadius: answer.woofRadius,
        };
        break;
      case "wenda":
        characterCoords = {
          charCoordX: answer.wendaX,
          charCoordY: answer.wendaY,
          charRadius: answer.wendaRadius,
        };
        break;
      case "whitebeard":
        characterCoords = {
          charCoordX: answer.whitebeardX,
          charCoordY: answer.whitebeardY,
          charRadius: answer.whitebeardRadius,
        };
        break;
      case "odlaw":
        characterCoords = {
          charCoordX: answer.odlawX,
          charCoordY: answer.odlawY,
          charRadius: answer.odlawRadius,
        };
        break;
      default:
        console.log("Error: No character selected");
    }
    return characterCoords;
  }

  // Get leaderboard results when
  useEffect(() => {
    console.log(foundCharacters);
    if (foundCharacters.length === 5) {
      console.log("found all chars");
    }
    const records = async function () {
      const data = await getRecords(selectedImageIndex);
      console.log(data);
      Array.from(data).map((record) => (
        <div key={record[0]}>
          <span>{record[0]}</span>
          <span>{record[1]}</span>
        </div>
      ));
    };
    records();
  }, [foundCharacters]);

  useEffect(() => {
    setInitialTime(new Date());
    console.log(initialTime);
  }, [selectedImage]);

  return (
    <div>
      <div className="imagePreviewContainer">{imageList}</div>
      <p>Find the following characters in the picture:</p>
      <img src={charactersPic} alt="Characters" />
      <div>
        X: {posX} Y: {posY}
      </div>
      {Image}
      {popup}
    </div>
  );
};

export default Waldo;
