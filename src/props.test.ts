import { ElementPropFactory } from "./propsBase";
import props from "./props";
import { PropUpdate } from "./signal";

type UpdaterInput<Prop> = Prop extends ElementPropFactory<
  infer Name,
  infer Arg,
  infer Normalized
>
  ? Arg
  : never;

type TestCaseInput<PropFactory> = [
  UpdaterInput<PropFactory> | undefined,
  UpdaterInput<PropFactory> | undefined,
  string | null | undefined
];

type TestCaseMap = {
  [key in keyof typeof props]: TestCaseInput<typeof props[key]>[];
};

const testCases: TestCaseMap = {
  int: [
    [1, undefined, null],
    [undefined, 1, "1"],
    [1, 1, undefined],
    [0, 1, "1"],
    [0, 0.5, undefined],
  ],
  int2: [
    [{ x: 1, y: 1 }, undefined, null],
    [undefined, { x: 1, y: 1 }, "[1;1]"],
    [{ x: 1 }, { x: 1, y: 1 }, "[1;1]"],
    [{ x: 1 }, { y: 1 }, "[0;1]"],
    [{ x: 1 }, { x: 1 }, undefined],
    [{ x: 1 }, {}, "[0;0]"],
    [{ x: 0, y: 0 }, {}, undefined],
    [{ x: 1, y: 1 }, { x: 1, y: 1 }, undefined],
    [{ x: 1, y: 1 }, { x: 2, y: 1 }, "[2;1]"],
    [{ x: 1, y: 1 }, { x: 1, y: 2 }, "[1;2]"],
    [{ x: 1.5, y: 1.3 }, { x: 1.5, y: 1.2 }, undefined],
  ],
  int3: [
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
    [{ x: 1.5, y: 1.3, z: 1.4 }, { x: 1.3, y: 1.2, z: 1.3 }, undefined],
  ],
  int4: [
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
    [
      { x: 1.3, y: 1.2, z: 1.1, w: 1.5 },
      { x: 1.2, y: 1.3, z: 1.2, w: 1.1 },
      undefined,
    ],
  ],
  float: [
    [1, undefined, null],
    [undefined, 1, "1"],
    [1, 1, undefined],
    [0, 1, "1"],
    [0, 0.5, "0.5"],
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
    [{ x: 1, y: 1 }, { x: 1.1, y: 1 }, "[1.1;1]"],
    [{ x: 1, y: 1 }, { x: 1, y: 1.1 }, "[1;1.1]"],
    [{ x: 1.5, y: 1.3 }, { x: 1.4, y: 1.2 }, "[1.4;1.2]"],
  ],
  float3: [
    [{ x: 1, y: 1, z: 1 }, undefined, null],
    [undefined, { x: 1, y: 1, z: 1 }, "[1;1;1]"],
    [{ x: 1 }, { x: 1, y: 1, z: 1 }, "[1;1;1]"],
    [{ x: 1 }, { z: 1 }, "[0;0;1]"],
    [{ x: 1 }, { y: 1 }, "[0;1;0]"],
    [{ x: 0, y: 0, z: 0 }, {}, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 1.3, y: 1, z: 1 }, "[1.3;1;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1.2, z: 1 }, "[1;1.2;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1.1 }, "[1;1;1.1]"],
    [{ x: 1.5, y: 1.3, z: 1.4 }, { x: 1.3, y: 1.2, z: 1.3 }, "[1.3;1.2;1.3]"],
  ],
  float4: [
    [{ x: 1, y: 1, z: 1, w: 1 }, undefined, null],
    [undefined, { x: 1, y: 1, z: 1, w: 1 }, "[1;1;1;1]"],
    [{ x: 1, w: 1 }, { x: 1, y: 1, z: 1, w: 1 }, "[1;1;1;1]"],
    [undefined, {}, "[0;0;0;0]"],
    [{ x: 0, y: 0, z: 0, w: 0 }, {}, undefined],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1, z: 1, w: 1 }, undefined],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1.1, y: 1, z: 1, w: 1 }, "[1.1;1;1;1]"],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1.1, z: 1, w: 1 }, "[1;1.1;1;1]"],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1, z: 1.1, w: 1 }, "[1;1;1.1;1]"],
    [{ x: 1, y: 1, z: 1, w: 1 }, { x: 1, y: 1, z: 1, w: 1.1 }, "[1;1;1;1.1]"],
    [
      { x: 1.3, y: 1.2, z: 1.1, w: 1.5 },
      { x: 1.2, y: 1.3, z: 1.2, w: 1.1 },
      "[1.2;1.3;1.2;1.1]",
    ],
  ],
  floatQ: [
    [{ x: 1, y: 1, z: 1 }, undefined, null],
    [undefined, { x: 1, y: 1, z: 1 }, "[1;1;1]"],
    [undefined, {}, "[0;0;0]"],
    [{ x: 0, y: 0, z: 0 }, {}, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, undefined],
    [{ x: 1, y: 1, z: 1 }, { x: 1.1, y: 1, z: 1 }, "[1.1;1;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1.1, z: 1 }, "[1;1.1;1]"],
    [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1.1 }, "[1;1;1.1]"],
  ],
  color: [
    [{ r: 1, g: 1, b: 1, a: 1 }, undefined, null],
    [undefined, { r: 1, g: 1, b: 1, a: 1 }, "[1;1;1;1]"],
    [undefined, { r: 1, g: 1, b: 1 }, "[1;1;1;1]"],
    [undefined, {}, "[0;0;0;1]"],
    [{ r: 0, g: 0, b: 0, a: 1 }, {}, undefined],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1, a: 1 }, undefined],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1 }, undefined],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1.1, g: 1, b: 1, a: 1 }, "[1.1;1;1;1]"],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1.1, b: 1, a: 1 }, "[1;1.1;1;1]"],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1.1, a: 1 }, "[1;1;1.1;1]"],
    [{ r: 1, g: 1, b: 1, a: 1 }, { r: 1, g: 1, b: 1, a: 1.1 }, "[1;1;1;1.1]"],
  ],
  string: [
    ["a", undefined, null],
    ["a", "b", "b"],
    ["b", ["a", "b", "c"], "a%20b%20c"],
    ["b", ["a", undefined, "c"], "a%20c"],
    ["b", ["a", "", "c"], "a%20c"],
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
  slot: [],
  texture2d: [],
  mesh: [],
};

function testPropFactory<
  TypeName extends string,
  PropFactory extends ElementPropFactory<TypeName, unknown, unknown>
>(
  typeName: TypeName,
  factory: PropFactory,
  [oldValue, newValue, expected]: TestCaseInput<PropFactory>
) {
  const diff: Omit<PropUpdate<TypeName>, "prop">[] = [];
  factory.field().field(oldValue, newValue, {
    diff: (d: Omit<PropUpdate<TypeName>, "prop">) => diff.push(d),
  });
  expect(diff[0]).toStrictEqual(
    expected === undefined
      ? undefined
      : {
          type: typeName,
          value: expected,
        }
  );
}

test("Test case maps", () => {
  for (const cases in testCases) {
    for (const testCase of testCases[cases as keyof typeof testCases]) {
      testPropFactory(
        cases as any,
        (props as any)[cases as any] as any,
        testCase
      );
    }
  }
});
