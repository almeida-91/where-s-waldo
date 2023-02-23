import React from "react";
import "./footer.css";
import gitIcon from "./images/github.png";

const Footer = () => {
  return (
    <div className="footer">
      <p>
        Developed by <a href="https://github.com/almeida-91">Almeida-91</a>
      </p>
      <img src={gitIcon}></img>
    </div>
  );
};

export default Footer;
