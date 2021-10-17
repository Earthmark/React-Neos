import React from "react";
import n from "react-neos";

const MoreComplicatedBox = () => {
  const [buttons] = React.useState(() => [{
    text: "Option A",
    color: {r: 1}
  },
  {
    text: "Option B",
    color: {g: 1}
  },
  {
    text: "Option C",
    color: {b: 1}
  }]);

  return <n.transform>
  <n.box name="tiny square thing" size={{x: 1, y:2, z: 0.01}} albedoColor={{r:1}}/>
    <n.canvas name="Box canvas" position={{x: -0.5, y: 0, z: 0}}>
      <n.verticalLayout>
        {buttons.map((button, index) =>
          <n.text key={index} color={button.color}>
          {button.text}
        </n.text>
        )}
      </n.verticalLayout>
    </n.canvas>
  </n.transform>;
}

export default MoreComplicatedBox;