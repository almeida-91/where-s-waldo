import React, { useState } from "react";
import SignIn from "./signin";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./logscreen.css";

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
    }
  });

  const handleClick = () => {
    signOut(getAuth());
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="login">
          <span>Welcome, {name} </span>
          <div className="userPic">
            <img src={userPic} alt="user profile" />

            <button onClick={handleClick}>Logout</button>
          </div>
        </div>
      ) : (
        <div className="login">
          <span>Welcome, {name} </span>
          <SignIn />
        </div>
      )}
    </div>
  );
};

export default LogScreen;
