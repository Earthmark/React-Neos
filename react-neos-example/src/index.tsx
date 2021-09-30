import React from 'react';
import TestRenderer from 'react-test-renderer';
import neosRenderer from "react-neos-renderer";
import {Color} from 'react-neos';

type Potato = {
  name: string;
  color: Color;
}

const Helper2 = () => {
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
            <nText key={item.name} nullText="Tacos not provided..." color={item.color}>
              I am a potato!
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
  <Helper2/>
</div>);

const renderer = neosRenderer();
renderer.render(<Helper2 />);

console.log(JSON.stringify(test.toJSON(), null, 2));
