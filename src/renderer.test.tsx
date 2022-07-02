import React from 'react';
import createRender from "./renderer.js";
import { useNeosRef } from "./componentsBase.js";
import n, { componentDefs } from "./components.js";
import { EventSignal, OutboundSignal } from './signal.js';

interface Fixture {
  toggleCanvas?: boolean,
  toggleChildBox?: boolean,
  subValue?: { x: number, y: number },
  objects: Array<{
    id: string
  }>
}

test("Verify hierarchy shows as expected", () => {
  var updater: (handler: (newController: Fixture) => Fixture) => void = () => { };

  const TestComponent = () => {
    const r = React.useRef();
    const [c, setFixture] = React.useState<Fixture>(() => ({
      toggleCanvas: false,
      objects: [{ id: "1" }]
    }));
    updater = setFixture;
    return <React.Fragment>
      <n.transform position={{ x: 2, y: 4, z: 19 }}>
        {
          c.toggleCanvas ?
            <n.boxMesh /> :
            <n.text>
              This contains text!
            </n.text>
        }
        <n.canvas>
          {
            c.objects.map(o =>
              <n.text key={o.id} anchorMin={c.subValue}>
                {o.id}
              </n.text>)
          }
        </n.canvas>
      </n.transform>
      {
        c.toggleChildBox ? <n.boxMesh /> : null
      }
      <n.transform />
    </React.Fragment>;
  }

  const renderer = createRender(<TestComponent />, componentDefs);
  const items: Array<OutboundSignal> = [];
  const instance = renderer.createInstance(signal => items.push(signal));

  const s : EventSignal = {
    signal: "event",
    id: "0",
    event: "add",
    arg: "taco"
  };

  instance.render(s);
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, toggleChildBox: true }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, toggleChildBox: false }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, subValue: { x: 2, y: 4 } }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, subValue: undefined }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, objects: [{ id: "1" }, { id: "2" }, { id: "3" }] }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, objects: [{ id: "1" }, { id: "3" }] }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, objects: [{ id: "1" }, { id: "2" }, { id: "3" }] }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  updater(b => ({ ...b, toggleCanvas: true }));
  expect(items).toMatchSnapshot();
  items.length = 0;

  instance.render(
    {
      signal: "event",
      id: "1",
      event: "click",
      arg: "payload"
    }
  )
  expect(items).toMatchSnapshot();
  items.length = 0;
});

test("Refs Interconnect", () => {
  const TestComponent = () => {
    const [unlitMat, refUnlitMat] = useNeosRef(n.unlitMaterial);
    const [trs, refTransform] = useNeosRef(n.transform);
    return <React.Fragment>
      <n.unlitMaterial color={{ r: 1, g: 0, b: 1 }} ref={refUnlitMat} />
      <n.transform position={{ x: 2, y: 4, z: 19 }} ref={refTransform} >
        <n.meshRenderer material={unlitMat.material} />
      </n.transform>
    </React.Fragment>;
  }

  const renderer = createRender(<TestComponent />, componentDefs);
  const items: Array<OutboundSignal> = [];
  renderer.createInstance(signal => items.push(signal));

  expect(items).toMatchSnapshot();
});

test("unexpected components raise errors", () => {
  const renderer = createRender(<div />, componentDefs);
  const items: Array<OutboundSignal> = [];
  expect(() => renderer.createInstance(signal => items.push(signal))).toThrowError();
});

test("components raise errors when they unexpectedly contain text", () => {
  const renderer = createRender(<n.transform>{"I'm illegal!" as any}</n.transform>, componentDefs);
  const items: Array<OutboundSignal> = [];
  expect(() => renderer.createInstance(signal => items.push(signal))).toThrowError();
});
