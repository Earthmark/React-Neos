import React from 'react';
import renderer from "./NeosRenderer";
import TestRenderer from "react-test-renderer";
import {ElementPropStringifyMap} from "./NeosElement";

test("Verify failure", () => {
  expect(renderer).toBeDefined();
  expect(true).toBe(true);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<nTransform scale={3} />).toJSON()).toMatchSnapshot();
});

test("verify slot stringifies as expected", () => {
  const dest: Array<string> = [];
  ElementPropStringifyMap.nTransform(
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
    arr: dest,
    events: {}
  });
  expect(dest).toStrictEqual(["active=bool#$", "scale=float3#[3;3;3]"]);
});

type TestCaseMap = {
  [key in keyof typeof ElementPropStringifyMap]: 
    PropsOfStringify<typeof ElementPropStringifyMap[key]>[]
};

type PropsOfStringify<G> = G extends (g: infer Gatherer) => unknown
  ? Gatherer
  : never;

const testCases : TestCaseMap = {
  nTransform: [{
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
    arr: ["active=bool#$", "scale=float3#[3;3;3]"],
    events: {}
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
      "persistent=bool#true",
      "position=float3#[1;2;43]",
      "scale=float3#[3;3;3]"
    ],
    events: {}
  }],
  nSmoothTransform: [],
  nCanvas: [],
  nRectTransform: [],
  nText: [],
  nButton: []
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

