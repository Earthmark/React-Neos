import React from "react";
import TestRenderer from 'react-test-renderer';
import neosRenderer from './NeosRenderer';

type Potato = {
  name: string;
  color: [number, number, number];
}

const Helper2 = ({v}: {v: string}) => {
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
    <nSlot rotation={[60, 0, 0]}>
      <nCanvas>
        <nRectTransform anchorMax={[0.25, 0.5]}>
          {
            items.map(item => 
            <nText key={item.name} nullText={v} color={item.color}>
              I am a {v}
              potato!
            </nText>)
          }
        </nRectTransform>
      </nCanvas>
    </nSlot>
  </nSlot>;
}

const Helper : () => JSX.Element = () => {
  return <div>helper</div>;
}

const test = TestRenderer.create(
<div>
  <Helper/>
  <Helper2 v="Potato"/>
</div>);

export default () => {
  const renderer = neosRenderer();
  renderer.render(<Helper2 v="Taco" />);
  console.log("Change done, re-rendering");
  renderer.render(<Helper2 v="Tucana" />);
  
  console.log(JSON.stringify(test.toJSON(), null, 2));
}
