import React from "react";
import n, { p } from "react-neos";

const MenuBox = () => {
  const [buttons] = React.useState(() => [{
    text: "Option A",
    color: p.rgb1(1, 0, 0)
  },
  {
    text: "Option B",
    color: p.rgb1(1, 0, 0)
  },
  {
    text: "Option C",
    color: p.rgb1(1, 0, 0)
  }]);

  return <n.transform>
    <n.box name="tiny square thing" size={p.xyz(1, 2, 0.01)} albedoColor={p.rgb1(1,0,0)}/>
    <n.canvas name="Box canvas" position={p.xyz(-0.5, 0, 0)}>
      <n.verticalLayout>
        {buttons.map((button, index) =>
          <n.image key={index} color={p.rrr1(0)}>
            <n.text color={button.color}>
              {button.text}
            </n.text>
          </n.image>
        )}
      </n.verticalLayout>
    </n.canvas>
  </n.transform>;
}

export default MenuBox;