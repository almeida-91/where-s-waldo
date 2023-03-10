import React, { useEffect } from "react";
import "moment/locale/pt";
import moment from "moment-timezone";

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
import { getRecords, getSolutions, saveNewHighScore } from "./serverdata";
import { loggedUser } from "../googleSignin/logScreen";
import LeaderBoard from "./LeaderBoard";

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
  const [isImageSelected, setisImageSelected] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [initialTime, setInitialTime] = useState();
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [gameTime, setGameTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [recordTable, setRecordTable] = useState();
  const [foundPositions, setFoundPositions] = useState([]);
  const [markers, setMarkers] = useState();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [timeDelta, setTimeDelta] = useState();
  const [anonymousName, setAnonymousName] = useState("Anonymous");
  const imageContainer = document.getElementsByClassName("imageContainer")[0];

  function handleMove(e) {}

  const handleClick = (e) => {
    setClickPosition({
      x: e.pageX - imageContainer.offsetLeft + imageContainer.scrollLeft,
      y: e.pageY - imageContainer.offsetTop + imageContainer.scrollTop,
    });
    setposX(e.pageX);
    setposY(e.pageY);

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
      onClick={async () => {
        setSelectedImage(image);
        setSelectedImageIndex(index + 1);
        setInitialTime(new Date());
        setFoundCharacters([]);
        setisImageSelected(true);
        await getScores();
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
      <div className="inputLine">
        <div>
          <input
            type={"radio"}
            name="charSelect"
            id={character}
            value={character}
            onChange={(e) => {
              setSelectedChar(e.currentTarget.id.toLowerCase());
            }}
          />{" "}
          <span>{character}</span>
        </div>
        <img src={charImages[index]} alt={character} />
      </div>
    </label>
  ));

  const foundCharacter = () => {
    const x = clickPosition.x - 35 + "px";
    const y = clickPosition.y - 35 + "px";
    return { left: x, top: y };
  };

  // Check the backend to check if the mouse was clicked within that
  // character's radius
  async function submitAnswer(e) {
    e.preventDefault();
    document.getElementById("popup").classList.remove("showPopUp");
    setisActive(true);
    const answer = await getCharacter(selectedChar, selectedImageIndex);
    const deltaX = clickPosition.x - answer.charCoordX;
    const deltaY = clickPosition.y - answer.charCoordY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < answer.charRadius) {
      if (!foundCharacters.includes(selectedChar)) {
        setFoundCharacters([...foundCharacters, selectedChar]);
        setFoundPositions([...foundPositions, foundCharacter()]);
      }
    }
  }

  const getMarkers = () => {
    const markers = foundPositions.map((position, index) => (
      <div key={index} style={position} className="foundChar"></div>
    ));
    setMarkers(markers);
  };

  // Get coordinates and radius for the character we're checking
  // from the backend server
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
        console.error("Error: No character selected");
    }
    return characterCoords;
  }

  // Get game time when player finds 5 characters
  useEffect(() => {
    if (foundCharacters.length === 5) {
      calculateTime();
    }
    getMarkers();
  }, [foundCharacters]);

  // Get leaderboard results when
  // player selects a picture
  useEffect(() => {
    restartGame();
    getScores();
  }, []);

  const popupStyle = {
    left: posX + "px",
    top: posY + "px",
  };
  const popup = (
    <div style={popupStyle} id="popup" className="userClick">
      <form onSubmit={submitAnswer}>
        {characterSelection}
        <button type="submit">Submit</button>
      </form>
    </div>
  );

  // Check if the score is a high score
  const isHighScore = () => {
    const sortedScores = recordTable.sort((a, b) => a.score - b.score);
    if (timeDelta < sortedScores[4].score) {
      return true;
    }
    return false;
  };

  const newScore = () => {
    let score;
    if (loggedUser) {
      score = {
        name: loggedUser.displayName,
        time: gameTime,
        score: timeDelta,
      };
    } else {
      score = {
        name: anonymousName,
        time: gameTime,
        score: timeDelta,
      };
    }
    return score;
  };

  const saveHighScore = async () => {
    await saveNewHighScore(selectedImageIndex, newScore());
  };

  // Show leaderboard when the game is finished
  const showLeaderBoard = (
    <div className="endGame">
      <LeaderBoard imageIndex={selectedImageIndex} />
      <div className="currentScoreDiv">
        {loggedUser ? (
          <div className="currentScore">
            <table className="currentScore">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr id="currentScoreRow">
                  <td>{loggedUser.displayName}</td>
                  <td>{gameTime}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="currentScoreDiv">
            <table className="currentScore">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr id="currentScoreRow">
                  <td>Anonymous</td>
                  <td>{gameTime}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div>
        {endTime && loggedUser && isHighScore() ? (
          <div className="highScoreDiv">
            <p>Congratulations!! You got a new High Score!!</p>
            <button id="saveHighScore" onClick={saveHighScore}>
              Save High Score
            </button>
          </div>
        ) : null}
      </div>
      <div>
        {endTime && !loggedUser && isHighScore() ? (
          <div className="highScoreDiv">
            <label htmlFor="anonymousScore">
              Enter Your Name:
              <input
                className="scoreInput"
                type="text"
                defaultValue={anonymousName}
                name="anonymousScore"
                onChange={(e) => {
                  setAnonymousName(e.target.value);
                }}
              ></input>
            </label>
            <p className="scoreCongrats">
              Congratulations!! You got a new High Score!!
            </p>
            <button id="saveHighScore" onClick={saveHighScore}>
              Save High Score
            </button>
          </div>
        ) : null}
      </div>
      <button id="resetGame" onClick={restartGame}>
        Reset
      </button>
    </div>
  );

  const getScores = async () => {
    let recordsLog = null;
    const data = await getRecords(selectedImageIndex);
    recordsLog = data.records;
    setRecordTable(recordsLog);
  };

  const calculateTime = () => {
    setEndTime(new Date());
    const end = new Date();
    if (end) {
      setTimeDelta(end - initialTime);
      const timeDelta = end - initialTime;
      const minutesSeconds = moment.utc(timeDelta).format("mm:ss");
      const hours = Math.floor(moment.duration(timeDelta).asHours());
      setGameTime(hours + ":" + minutesSeconds);
      if (timeDelta < recordTable[recordTable.length - 1]) {
        setIsNewHighScore(true);
      }
    }
  };

  const showGame = (
    <div className="mainGameDiv">
      <button
        onClick={() => {
          setisImageSelected(false);
          restartGame();
        }}
      >
        Select another image
      </button>
      <div className="imageContainer">
        {Image}
        {markers}
      </div>
      {popup}
      <LeaderBoard imageIndex={selectedImageIndex} />
      {endTime ? showLeaderBoard : null}
    </div>
  );

  const imageSelect = (
    <div className="imageSelection">
      <p>Select a picture to start the game:</p>
      <div className="imagePreviewContainer">{imageList}</div>
    </div>
  );

  function restartGame() {
    setEndTime(null);
    setGameTime(null);
    setFoundCharacters([]);
    setFoundPositions([]);
    setInitialTime(new Date());
    setIsNewHighScore(false);
    getScores();
    setisImageSelected(false);
    setMarkers();
  }

  return (
    <div className="waldoGame">
      <div className="characterImage">
        <p>Find the following characters in the picture:</p>
        <img src={charactersPic} alt="Characters" className="charactersPic" />
      </div>
      {isImageSelected ? showGame : imageSelect}
    </div>
  );
};

export default Waldo;
