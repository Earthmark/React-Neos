import React from 'react';
import renderer, { PropsDelta } from "./NeosRenderer";
import TestRenderer from "react-test-renderer";
import elementDefs, {ElementProps} from "./NeosElement";

test("Verify failure", () => {
  expect(renderer).toBeDefined();
  expect(true).toBe(true);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<nTransform scale={3} />).toJSON()).toMatchSnapshot();
});

test("verify slot stringifies as expected", () => {
  const propDiffs: Array<string> = [];
  elementDefs.nTransform({
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
  expect(propDiffs).toStrictEqual(["active=bool#$", "scale=float3#[3;3;3]"]);
});

const testCases : {
  [key in keyof ElementProps]: 
  {
    oldProps: ElementProps[key],
    newProps: ElementProps[key],
    expected: Array<string>
  }[]
} = {
  nTransform: [{
    oldProps: {
      active: true,
      persistent: true,
      scale: 2,
    },
    newProps: {
      persistent: true,
      scale: 3,
    },
    expected: ["active=bool#$", "scale=float3#[3;3;3]"],
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
      "persistent=bool#true",
      "position=float3#[1;2;43]",
      "scale=float3#[3;3;3]"
    ],
  }],
  nSmoothTransform: [],
  nSpinner: [],
  nBox: [],
  nCanvas: [],
  nRectTransform: [],
  nText: [],
  nButton: [],
}

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.map((o) => ({ name: k as keyof typeof elementDefs, ...o}))
  )
)("element processes expected diff for set %s", ({name, oldProps, newProps, expected}) => {
  const src: Array<string> = [];
  elementDefs[name](oldProps as any, newProps as any, {
    propDiffs: src,
  });
  expect(src).toStrictEqual(expected);
});

