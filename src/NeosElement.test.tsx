import React from 'react';
import renderer from "./NeosRenderer";
import TestRenderer from "react-test-renderer";
import {ElementPropStringifyMap} from "./NeosElement";

test("Verify failure", () => {
  expect(renderer).toBeDefined();
  expect(true).toBe(true);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<nSlot scale={3} />).toJSON()).toMatchSnapshot();
});

test("verify slot stringifies as expected", () => {
  const dest: Array<string> = [];
  ElementPropStringifyMap.nSlot(
    {
    oldProps: {
      active: true,
      persistent: true,
      scale: 2,
    },
    newProps: {
      active: null,
      persistent: true,
      scale: 3,
    },
    arr: dest
    }
  );
  expect(dest).toStrictEqual(["active=b#$", "scale=f3#[3;3;3]"]);
});

type TestCaseMap = {
  [key in keyof typeof ElementPropStringifyMap]: 
    PropsOfStringify<typeof ElementPropStringifyMap[key]>[]
};

type PropsOfStringify<G> = G extends (g: infer Gatherer) => unknown
  ? Gatherer
  : never;

const testCases : TestCaseMap = {
  nSlot: [{
    oldProps: {
      active: true,
      persistent: true,
      scale: 2,
    },
    newProps: {
      active: null,
      persistent: true,
      scale: 3,
    },
    arr: ["active=b#$", "scale=f3#[3;3;3]"]
  },
  {
    oldProps: {
    },
    newProps: {
      active: null,
      persistent: true,
      position: {x: 1, y: 2, z: 43},
      scale: 3,
    },
    arr: [
      "persistent=b#true",
      "position=f3#[1;2;43]",
      "scale=f3#[3;3;3]"
    ]
  }],
  nSmoothTransform: [],
  nCanvas: [],
  nRectTransform: [],
  nText: []
}

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.map((o) => ({ name: k, ...o}))
  )
)("element processes expected diff for set %s", ({name, oldProps, newProps, arr}) => {
  const src: Array<string> = [];
  (ElementPropStringifyMap as any)[name as any]({
    oldProps,
    newProps,
    arr: src
  });
  expect(src).toStrictEqual(arr);
});

