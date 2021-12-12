import React from 'react';
import createRender from "./renderer";
import {useNeosRef} from "./componentsBase";
import n from "./components";

interface Fixture {
  toggleCanvas?: boolean,
  toggleChildBox?: boolean,
  subValue?: {x: number, y: number},
  objects: Array<{
    id: string
  }>
}

test("Verify hierarchy shows as expected", () => {
  var updater: (handler: (newController: Fixture) => Fixture) => void = () => {};

  const TestComponent = () => {
    const r = React.useRef();
    const [c, setFixture] = React.useState<Fixture>(() => ({
      toggleCanvas: false,
      objects: [{id: "1"}]
    }));
    updater = setFixture;
    return <React.Fragment>
      <n.transform position={{x: 2, y: 4, z: 19}}>
        {
          c.toggleCanvas ?
          <n.box /> :
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
        c.toggleChildBox ? <n.box/> : null
      }
      <n.transform/>
    </React.Fragment>;
  }

  const renderer = createRender(<TestComponent/>);
  const instance = renderer.createInstance();

  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, toggleChildBox: true}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, toggleChildBox: false}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, subValue: { x: 2, y: 4 }}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, subValue: undefined}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, objects: [{id: "1"}, {id: "2"}, {id: "3"}]}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, objects: [{id: "1"}, {id: "3"}]}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, objects: [{id: "1"}, {id: "2"}, {id: "3"}]}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b => ({...b, toggleCanvas: true}));
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  expect(instance.render([
    {
      signal: "event",
      id: "1",
      event: "click",
      arg: "payload"
    }
  ])).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);
});

test("Refs Interconnect", () => {
  const TestComponent = () => {
    const [unlitMat, refUnlitMat] = useNeosRef<typeof n.unlitMaterial>();
    const [trs, refTransform] = useNeosRef<typeof n.transform>();
    return <React.Fragment>
      <n.unlitMaterial color={{ r: 1, g: 0, b: 1 }} ref={refUnlitMat} />
      <n.transform position={{x: 2, y: 4, z: 19}} ref={refTransform} >
        <n.meshRenderer material={unlitMat?.self} />
      </n.transform>
    </React.Fragment>;
  }

  const renderer = createRender(<TestComponent/>);
  const instance = renderer.createInstance();

  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);
});

test("unexpected components raise errors", () => {
  const renderer = createRender(<div/>);
  const instance = renderer.createInstance();
  expect(() => instance.render()).toThrowError();
});

test("components raise errors when they unexpectedly contain text", () => {
  const renderer = createRender(<n.transform>{"I'm illegal!" as any}</n.transform>);
  const instance = renderer.createInstance();
  expect(() => instance.render()).toThrowError();
});
