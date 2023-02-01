import React, { useState } from "react";
import SignIn from "./signin";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth();

const LogScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("Anonymous");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      setName(user.displayName);
      setIsLoggedIn(true);
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
        <div>
          Welcome, {name} <button onClick={handleClick}>Logout</button>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default LogScreen;
