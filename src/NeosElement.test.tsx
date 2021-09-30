import React from 'react';
import renderer from "./NeosRenderer";
import TestRenderer from "react-test-renderer";

test("Verify failure", () => {
  expect(renderer).toBeDefined();
  expect(true).toBe(true);
});

test("Verify hierarchy shows as expected", () => {
  expect(TestRenderer.create(<nSlot scale={3} />).toJSON()).toMatchSnapshot();
});
