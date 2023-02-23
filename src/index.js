import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Waldo from "./components/game/Waldo.js";
import LogScreen from "./components/googleSignin/logScreen";
import Footer from "./components/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LogScreen />
    <Waldo />
    <Footer />
  </React.StrictMode>
);
