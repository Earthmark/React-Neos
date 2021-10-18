import React from "react";
import n from "react-neos";

const SmallRedBox = () => {
  return <n.box name="tiny square thing" size={{x: 100, y: 20000, z: 0.01}} albedoColor={{r: 1, g: 0, b: 0}} />;
};

export default SmallRedBox;