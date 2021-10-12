import React from "react";
import n from "react-neos";

const Helper2 = ({v, i}: {v: string, i?: number}) => {
  const [scale, setScale] = React.useState(1);
  const [items, setItems] = React.useState([{
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
          <n.box size={[2, 0.1, 0.01]} />
        </n.transform>
      </n.spinner>
    </n.transform>
  </n.transform>;
}

export default () => <Helper2 v="Taco" i={1} />;
