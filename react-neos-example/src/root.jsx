import React from "react";
import n from "react-neos";

const MenuBox = () => {
  const [buttons] = React.useState(() => [{
    text: "Option A",
    color: [1, 0, 0]
  },
  {
    text: "Option B",
    color: [0, 1, 0]
  },
  {
    text: "Option C",
    color: [0, 0, 1]
  }]);

  return <n.box name="tiny square thing" size={[1, 2, 0.01]} albedoColor={[1,0,0]}>
    <n.canvas name="Box canvas" position={[-0.5, 0, 0]}>
      <n.verticalLayout>
        {buttons.map((button, index) =>
          <n.image key={index} color={0}>
            <n.text color={button.color}>
              {button.text}
            </n.text>
          </n.image>
        )}
      </n.verticalLayout>
    </n.canvas>
  </n.box>;
}

export default MenuBox;