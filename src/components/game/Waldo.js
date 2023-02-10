import React, { useEffect } from "react";
import "moment/locale/pt";
import moment, { min } from "moment-timezone";

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
import { async } from "@firebase/util";
import { wait } from "@testing-library/user-event/dist/utils";
import { loggedUser } from "../googleSignin/logScreen";

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
  const [gameTime, setGameTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [globalMousePos, setGlobalMousePos] = useState({});
  const [recordTable, setRecordTable] = useState();
  const [foundPositions, setFoundPositions] = useState([]);
  const [markers, setMarkers] = useState();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [timeDelta, setTimeDelta] = useState();
  const [score, setScore] = useState();

  function handleMove(e) {
    let currentImage = document.getElementById("wally1");
    setposX(e.pageX - currentImage.offsetLeft + currentImage.scrollLeft);
    setposY(e.pageY - currentImage.offsetTop + currentImage.scrollTop);
  }

  const handleClick = (e) => {
    setClickPosition({ x: posX, y: posY });
    setGlobalMousePos({
      left: e.pageX,
      top: e.pageY,
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
        setInitialTime(new Date());
        setFoundCharacters([]);
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

  const foundCharacter = () => {
    const x = globalMousePos.left - 50 + "px";
    const y = globalMousePos.top - 50 + "px";
    return { left: x, top: y };
  };

  const popupStyle = {
    left: globalMousePos.left + "px",
    top: globalMousePos.top + "px",
  };
  const popup = (
    <div style={popupStyle} id="popup" className="userClick">
      <form onSubmit={submitAnswer}>
        {characterSelection}
        <button type="submit">Submit</button>
      </form>
    </div>
  );

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
      console.log(`Found ${selectedChar}`);
      if (!foundCharacters.includes(selectedChar)) {
        setFoundCharacters([...foundCharacters, selectedChar]);
        setFoundPositions([...foundPositions, foundCharacter()]);
        console.log(foundPositions);
      }
    } else {
      console.log("nope");
    }
  }

  const getMarkers = () => {
    const markers = foundPositions.map((position, index) => (
      <div key={index} style={position} className="foundChar">
        O
      </div>
    ));
    setMarkers(markers);
  };

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

  // Get game time when player finds 5 characters
  useEffect(() => {
    console.log(foundCharacters);
    if (foundCharacters.length === 5) {
      console.log("found all chars");
      calculateTime();
    } /* else {
      async function findChars() {
        await wait(3000);
        setFoundCharacters([1, 2, 3, 4, 5]);
      }
      findChars();
    } */
    getMarkers();
    console.log(markers);
  }, [foundCharacters, selectedImageIndex]);

  // Get leaderboard results when
  // player selects a picture
  useEffect(() => {
    restartGame();
  }, [selectedImageIndex]);

  // Check if the score is a high score
  const isHighScore = () => {
    if (timeDelta < recordTable[4].score) {
      return true;
    }
    return false;
  };

  const newScore = () => {
    const score = {
      name: loggedUser.displayName,
      time: gameTime,
      score: timeDelta,
    };
    return score;
  };

  const saveHighScore = async () => {
    await saveNewHighScore(selectedImageIndex, newScore());
  };

  // Show leaderboard when the game is finished
  const showLeaderBoard = (
    <div className="endGame">
      {leaderBoard}
      <div>
        {loggedUser ? (
          <>
            <span>{loggedUser.displayName}</span>
            <span>{gameTime}</span>
          </>
        ) : (
          <div></div>
        )}
      </div>
      {endTime && isHighScore() ? (
        <div>
          New High Score
          <button onClick={saveHighScore}>Save High Score</button>
        </div>
      ) : null}
      <button onClick={restartGame}>Reset</button>
    </div>
  );

  const getScores = () => {
    const records = async function () {
      const data = await getRecords(selectedImageIndex);
      const recordsLog = data.records;
      setRecordTable(recordsLog);
    };
    records();
    if (recordTable) {
      let recordFormat = recordTable.map((record, index) => (
        <tr key={index}>
          <td>{record.name}</td>
          <td>{record.time}</td>
        </tr>
      ));

      setLeaderBoard(
        <div>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Record</th>
              </tr>
              {recordFormat}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const calculateTime = async () => {
    setEndTime(new Date());
    const end = new Date();
    if (end) {
      setTimeDelta(end - initialTime);
      const timeDelta = end - initialTime;
      const minutesSeconds = moment.utc(timeDelta).format("mm:ss");
      const hours = Math.floor(moment.duration(timeDelta).asHours());
      setGameTime(hours + ":" + minutesSeconds);
      console.log(hours + ":" + minutesSeconds);
      console.log(gameTime);
      console.log(timeDelta);
      console.log(`end time: ${end}`);
      console.log(`start time: ${initialTime}`);
      if (timeDelta < recordTable[recordTable.length - 1]) {
        setIsNewHighScore(true);
      }
    }
  };

  function restartGame() {
    setEndTime(null);
    setGameTime(null);
    setFoundCharacters([]);
    setFoundPositions([]);
    setInitialTime(new Date());
    setIsNewHighScore(false);
    getScores();
  }

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
      {leaderBoard}
      {markers}
      {endTime ? showLeaderBoard : null}
    </div>
  );
};

export default Waldo;
