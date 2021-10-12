import React from 'react';
import renderer from "./neosRenderer";
import TestRenderer from "react-test-renderer";
import n, {ElementProps, elementDefs} from "./neosElement";
import {PropUpdate} from "./signalFormatter";

test("Verify failure", () => {
  expect(renderer).toBeDefined();
  expect(true).toBe(true);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<n.transform scale={3} />).toJSON()).toMatchSnapshot();
});

test("verify slot stringifies as expected", () => {
  const propDiffs: Array<PropUpdate> = [];
  elementDefs.transform({
      active: true,
      persistent: true,
      scale: 2,
    },
    {
      persistent: true,
      scale: 3,
    },
    {
      propDiffs
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

const testCases : {
  [key in keyof ElementProps]: 
  {
    oldProps: ElementProps[key],
    newProps: ElementProps[key],
    expected: Array<PropUpdate>
  }[]
} = {
  transform: [{
    oldProps: {
      active: true,
      persistent: true,
      scale: 2,
    },
    newProps: {
      persistent: true,
      scale: 3,
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
      position: {x: 1, y: 2, z: 43},
      scale: 3,
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
  }],
  smoothTransform: [],
  spinner: [],
  box: [],
  canvas: [],
  rect: [],
  text: [],
  button: [],
}

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.map((o) => ({ name: k as keyof typeof elementDefs, ...o}))
  )
)("element processes expected diff for set %s", ({name, oldProps, newProps, expected}) => {
  const src: Array<PropUpdate> = [];
  elementDefs[name](oldProps as any, newProps as any, {
    propDiffs: src,
  });
  expect(src).toStrictEqual(expected);
});

