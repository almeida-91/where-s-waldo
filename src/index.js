import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Waldo from "./components/game/Waldo.js";
import LogScreen from "./components/googleSignin/logScreen";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LogScreen />
    <Waldo />
  </React.StrictMode>
);
