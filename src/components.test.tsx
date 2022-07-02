import React from 'react';
import TestRenderer from "react-test-renderer";
import { PropUpdate } from "./signal.js";
import n, { ElementProps, componentDefs} from "./components.js";
import prop from "./props.js";
import {
  elementPropsToTemplate,
  elementTemplatesToJsxPrototypes,
} from "./componentsBase.js";

const simpleElement = elementPropsToTemplate({
  taco: prop.bool.field(),
});

const simpleObj = elementTemplatesToJsxPrototypes({ elem: simpleElement });

test("Single Bool element can be created and matches snapshot", () => {
  expect(TestRenderer.create(<simpleObj.elem taco={true} />).toJSON()).toMatchInlineSnapshot(`
<elem
  taco={true}
/>
`);
});
test("Single boolean element can be updated.", () => {
  const propDiffs: Array<PropUpdate> = [];
  simpleElement.updater({
      taco: false 
    },
    {
      taco: true 
    },
    {
      diff: d => propDiffs.push(d)
    }
  );
  expect(propDiffs).toMatchInlineSnapshot(`
Array [
  Object {
    "prop": "taco",
    "type": "bool",
    "value": "true",
  },
]
`);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<n.transform scale={{ x: 3, y: 3, z: 3 }} />).toJSON()).toMatchInlineSnapshot(`
<transform
  scale={
    Object {
      "x": 3,
      "y": 3,
      "z": 3,
    }
  }
/>
`);
});

test("verify slot stringifies as expected", () => {
  const propDiffs: Array<PropUpdate> = [];
  componentDefs.transform.updater({
      active: true,
      persistent: true,
      scale: {x: 2, y: 2, z: 2},
    },
    {
      persistent: true,
      scale: {x: 3, y: 3, z: 3},
    },
    {
      diff: d => propDiffs.push(d)
    }
  );
  expect(propDiffs).toMatchInlineSnapshot(`
Array [
  Object {
    "prop": "active",
    "type": "bool",
    "value": null,
  },
  Object {
    "prop": "scale",
    "type": "float3",
    "value": "[3;3;3]",
  },
]
`);
});

const testCases : Partial<{
  [key in keyof ElementProps]: 
  {
    oldProps: Partial<ElementProps[key]>,
    newProps: Partial<ElementProps[key]>,
    expected: Array<PropUpdate>
  }[]
}> = {
  transform: [{
    oldProps: {
      active: true,
      persistent: true,
      scale: {x: 2, y: 2, z: 2},
    },
    newProps: {
      persistent: true,
      scale: {x: 3, y: 3, z: 3},
    },
    expected: [{
      prop: "active",
      type: "bool",
      value: null,
    }, {
      prop: "scale",
      type: "float3",
      value: "[3;3;3]",
    }],
  },
  {
    oldProps: {
    },
    newProps: {
      persistent: true,
      position: {x: 1, y:2, z:43},
      scale: {x: 3, y: 3, z: 3},
    },
    expected: [
      {
        prop:"persistent",
        type:"bool",
        value:"true",
      },
      {
        prop: "position",
        type: "float3",
        value: "[1;2;43]",
      },
      {
        prop: "scale",
        type: "float3",
        value: "[3;3;3]",
      }
    ],
  }]
}

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    (v as any).map((o: any) => ({ name: k as keyof ElementProps, ...o}))
  )
)("element processes expected diff for set %s", ({name, oldProps, newProps, expected}) => {
  const src: Array<PropUpdate> = [];
  (componentDefs as any)[name as any].updater(oldProps as any, newProps as any, {
    diff: (d: any) => src.push(d),
  });
  expect(src).toStrictEqual(expected);
});

