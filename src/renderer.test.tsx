import React from 'react';
import createRender from "./renderer";
import n from "./components";

interface Controller {
  toggleCanvas?: boolean,
  objects: Array<{
    id: string
  }>
}

const TestComponent = ({routeController}:
  {routeController: (provider: (newController: Controller) => void) => void}) => {

  const [c, setC] = React.useState<Controller>(() => ({objects:[]}));

  routeController(setC);

  return <n.transform position={{x: 2, y: 4, z: 19}}>
    {
      c.toggleCanvas ? <n.smoothTransform>
        <n.box />
      </n.smoothTransform> : <n.canvas>
        <n.rect>
          <n.text>
            This contains text!
          </n.text>
        </n.rect>
      </n.canvas>
    }
    <n.canvas>
      {
        c.objects.map(o => 
          <n.text key={o.id}>
            {o.id}
          </n.text>)
      }
    </n.canvas>
  </n.transform>
}

test("Verify hierarchy shows as expected", () => {
  var updater:  (newController: Controller) => void = ()=>{};

  const b = {
    toggleCanvas: false,
    objects: [{id: "1"}]
  };
  const renderer = createRender(<TestComponent routeController={c => updater = c }/>);
  const instance = renderer.createInstance();

  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater(b);
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater({...b, objects: [{id: "1"}, {id: "2"}]});
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater({...b, objects: [{id: "2"}]});
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater({...b, objects: [{id: "1"}, {id: "2"}]});
  expect(instance.render()).toMatchSnapshot();
  expect(instance.render()).toStrictEqual([]);

  updater({...b, toggleCanvas: true});
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