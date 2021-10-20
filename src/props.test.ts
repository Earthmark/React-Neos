import { PropUpdater } from "./propsBase";
import props from "./props";

type UpdaterInput<Prop> = Prop extends PropUpdater<infer Arg> ? Arg : never;

type TestCaseMap = {
  [key in keyof typeof props]: [
    UpdaterInput<typeof props[key]> | undefined,
    UpdaterInput<typeof props[key]> | undefined,
    string | null | undefined
  ][];
};

const testCases: TestCaseMap = {
  float: [
    [1, undefined, null],
    [undefined, 1, "1"],
    [1, 1, undefined],
    [0, 1, "1"],
  ],
  float2: [
    [{ x: 1, y: 1 }, undefined, null],
    [undefined, { x: 1, y: 1 }, "[1;1]"],
    [{ x: 1 }, { x: 1, y: 1 }, "[1;1]"],
    [{ x: 1 }, { y: 1 }, "[0;1]"],
    [{ x: 1 }, { x: 1 }, undefined],
    [{ x: 1 }, {}, "[0;0]"],
    [{ x: 0, y: 0 }, {}, undefined],
    [{ x: 1, y: 1 }, { x: 1, y: 1 }, undefined],
    [{ x: 1, y: 1 }, { x: 1, y: 2 }, "[1;2]"],
    [{ x: 1, y: 1 }, { x: 2, y: 1 }, "[2;1]"],
  ],
  float3: [
    [{ x: 1, y: 1, z: 1 }, undefined, null],
    [undefined, { x: 1, y: 1, z: 1 }, "[1;1;1]"],
    [{ x: 1 }, { x: 1, y: 1, z: 1 }, "[1;1;1]"],
    [{ x: 1 }, { z: 1 }, "[0;0;1]"],
    [{ x: 1 }, { y: 1 }, "[0;1;0]"],
    [{ x: 0, y: 0, z: 0 }, {}, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 2, y: 1, z: 1 }, "[2;1;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 2, z: 1 }, "[1;2;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 2 }, "[1;1;2]"],
  ],
  float4: [
    [{ x: 1, y: 1, z: 1, w: 1 }, undefined, null],
    [undefined, { x: 1, y: 1, z: 1, w: 1 }, "[1;1;1;1]"],
    [{ x: 1, w: 1 }, { x: 1, y: 1, z: 1, w: 1 }, "[1;1;1;1]"],
    [undefined, {}, "[0;0;0;0]"],
    [{ x: 0, y: 0, z: 0, w: 0 }, {}, undefined],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1, z: 1, w: 1 }, undefined],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 2, y: 1, z: 1, w: 1 }, "[2;1;1;1]"],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 2, z: 1, w: 1 }, "[1;2;1;1]"],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1, z: 2, w: 1 }, "[1;1;2;1]"],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1, z: 1, w: 2 }, "[1;1;1;2]"],
  ],
  floatQ: [
    [{ x: 1, y: 1, z: 1 }, undefined, null],
    [undefined, { x: 1, y: 1, z: 1 }, "[1;1;1]"],
    [undefined, {}, "[0;0;0]"],
    [{ x: 0, y: 0, z: 0 }, {}, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 2, y: 1, z: 1 }, "[2;1;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 2, z: 1 }, "[1;2;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 2 }, "[1;1;2]"],
  ],
  color: [
    [{ r: 1, g: 1, b: 1, a: 1 }, undefined, null],
    [undefined, { r: 1, g: 1, b: 1, a: 1 }, "[1;1;1;1]"],
    [undefined, { r: 1, g: 1, b: 1 }, "[1;1;1;1]"],
    [undefined, {}, "[0;0;0;1]"],
    [{ r: 0, g: 0, b: 0, a: 1 }, {}, undefined],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1, a: 1 }, undefined],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1 }, undefined],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 2, g: 1, b: 1, a: 1 }, "[2;1;1;1]"],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 2, b: 1, a: 1 }, "[1;2;1;1]"],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 2, a: 1 }, "[1;1;2;1]"],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1, a: 2 }, "[1;1;1;2]"],
  ],
  string: [
    ["a", undefined, null],
    ["a", "b", "b"],
    ["b", ["a", "b", "c"], "a%20b%20c"],
    ["a b c", ["a", "b", "c"], undefined],
    [
      undefined,
      "@@#!%R@EFG%$T@# TATERS!",
      "%40%40%23!%25R%40EFG%25%24T%40%23%20TATERS!",
    ],
    [undefined, "!@#$%^&*()_+-=", "!%40%23%24%25%5E%26*()_%2B-%3D"],
  ],
  bool: [
    [true, undefined, null],
    [undefined, true, "true"],
    [undefined, false, "false"],
    [true, false, "false"],
  ],
};

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.map(([o, n, e]) => [k, o, n, e])
  )
)("%s should stringify %s and %s to %s", (type, oldVal, newVal, expected) => {
  const diff = [] as any;
  (props as any)[type as any](oldVal, newVal, {
    diff: (d: any) => diff.push(d),
  });
  expect(diff[0]).toStrictEqual(
    expected === undefined
      ? undefined
      : {
          type: type,
          value: expected,
        }
  );
});
