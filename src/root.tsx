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
      <nCanvas>
        <nButton onPress={() => setItems(ite => [...ite, {
          name: "new" + ite.length,
          color: [1, 1, 1]
        }])} >
        </nButton>
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
    </nTransform>
  </nTransform>;
}

export default () => <Helper2 v="Taco" i={1} />;
