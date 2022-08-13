import React from "react";
import './Pixel.css'

const Pixel = props => {
  return (
    <div
      className={`${props.background} pixel ${
        props.current ? "current-color" : ""
      }`}
      onClick={props.onClick}
    />
  );
};

export default Pixel;