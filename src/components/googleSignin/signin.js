import React from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";

const SignIn = () => {
  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.warn(errorCode + errorMessage);
      });
  };
  return <button onClick={handleClick}>Sign In</button>;
};

export default SignIn;
