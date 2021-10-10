import React from "react";
import n from "./NeosElement";

type Potato = {
  name: string;
  color: [number, number, number];
}

const Helper2 = ({v, i}: {v: string, i?: number}) => {
  const [scale, setScale] = React.useState(1);
  const [items, setItems] = React.useState<Potato[]>([{
    name: "russet",
    color: [1, 1, 0]
  },
  {
    name: "idaho",
    color: [0, 1, 1]
  },
  {
    name: "rubber",
    color: [1, 0, 1]
  }]);

  return <n.transform position={[2, 3, 2]} scale={scale}>
    <n.transform rotation={[0, 0, 0]} scale={i}>
      <n.spinner speed={[0,60,0]}>
        <n.transform position={[5,0,0]}>
          <n.text>{v}</n.text>
          <n.box size={[100, 20000, 0.01]} />
        </n.transform>
      </n.spinner>
    </n.transform>
  </n.transform>;
}

export default () => <Helper2 v="Taco" i={1} />;
