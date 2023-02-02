import React, { useState } from "react";
import SignIn from "./signin";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./logscreen.css";

const auth = getAuth();

const LogScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("Anonymous");
  const [userPic, setUserPic] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      setName(user.displayName);
      setIsLoggedIn(true);
      setUserPic(user.photoURL);
    } else {
      setIsLoggedIn(false);
      console.log(user);
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
            <img src={userPic} />

            <button onClick={handleClick}>Logout</button>
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default LogScreen;
