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

  return <nSlot position={[2, 3, 2]} scale={scale}>
    <nSlot rotation={[0, 0, 0]} scale={i}>
      <nCanvas>
        <nRectTransform anchorMax={[0.25, 0.5]}>
          {
            items.map(item => 
            <nText key={item.name} nullContent={v} color={item.color}>
              I am a {v}
              potato!
            </nText>)
          }
        </nRectTransform>
      </nCanvas>
    </nSlot>
  </nSlot>;
}

const f = () => 
<div onClick={() => {}}></div>;

export default () => <Helper2 v="Taco" i={1} />;
