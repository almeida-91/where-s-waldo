import React, { useState } from "react";
import SignIn from "./signin";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./logscreen.css";
import waldoLogo from "./images/logo.png";

const auth = getAuth();
export let loggedUser;

const LogScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("Anonymous");
  const [userPic, setUserPic] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setName(user.displayName);
      setIsLoggedIn(true);
      setUserPic(user.photoURL);
      loggedUser = user;
    } else {
      setIsLoggedIn(false);
      setName("Anonymous");
      loggedUser = null;
    }
  });

  const handleClick = () => {
    signOut(getAuth());
  };

  return (
    <div className="login">
      <div className="userInfo">
        {isLoggedIn ? (
          <div className="userPic">
            <img src={userPic} alt="user profile" />

            <button onClick={handleClick}>Sign Out</button>
          </div>
        ) : (
          <SignIn />
        )}
        <span>Welcome, {name} </span>
      </div>
      <div>
        <img src={waldoLogo} alt="Waldo"></img>
      </div>
      <div>
        <h1>
          <p>Where's</p>
          <p>Waldo</p>
        </h1>
      </div>
    </div>
  );
};

export default LogScreen;
