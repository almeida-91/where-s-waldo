import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Waldo from "./components/Waldo.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Waldo />
  </React.StrictMode>
);
