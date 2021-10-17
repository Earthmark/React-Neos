import React from 'react';
import renderer, { PropUpdate } from "./neosRenderer";
import TestRenderer from "react-test-renderer";
import n, { Props, elementDefs} from "./neosElement";
import { p } from "./primitives";

test("Verify failure", () => {
  expect(renderer).toBeDefined();
  expect(true).toBe(true);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<n.transform scale={p.xxx(3)} />).toJSON()).toMatchSnapshot();
});

test("verify slot stringifies as expected", () => {
  const propDiffs: Array<PropUpdate> = [];
  elementDefs.transform({
      active: true,
      persistent: true,
      scale: p.xxx(2),
    },
    {
      persistent: true,
      scale: p.xxx(3),
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

const testCases : {
  [key in keyof Props]: 
  {
    oldProps: Props[key],
    newProps: Props[key],
    expected: Array<PropUpdate>
  }[]
} = {
  transform: [{
    oldProps: {
      active: true,
      persistent: true,
      scale: p.xxx(2),
    },
    newProps: {
      persistent: true,
      scale: p.xxx(3),
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
      position: p.xyz(1, 2, 43),
      scale: p.xxx(3),
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
  image: [],
  horizontalLayout: [],
  verticalLayout: [],
}

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    (v as any).map((o: any) => ({ name: k as keyof Props, ...o}))
  )
)("element processes expected diff for set %s", ({name, oldProps, newProps, expected}) => {
  const src: Array<PropUpdate> = [];
  (elementDefs as any)[name as any](oldProps as any, newProps as any, {
    diff: (d: any) => src.push(d),
  });
  expect(src).toStrictEqual(expected);
});

