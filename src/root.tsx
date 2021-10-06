import React from "react";

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

  return <nTransform position={[2, 3, 2]} scale={scale}>
    <nTransform rotation={[0, 0, 0]} scale={i}>
      <nSpinner speed={[0,60,0]}>
        <nTransform position={[5,0,0]}>
            <nBox />
        </nTransform>
      </nSpinner>
    </nTransform>
  </nTransform>;
}

export default () => <Helper2 v="Taco" i={1} />;
