import differs from "./primitives";

type DifferInput<T> = T extends (
  oldProps: infer Arg,
  newProps: infer Arg,
  diff: { diff(o: { type: string; value: string | null }): void }
) => void
  ? Arg
  : never;

type TestCaseMap = {
  [key in keyof typeof differs]: [
    DifferInput<typeof differs[key]>,
    DifferInput<typeof differs[key]>,
    string | null
  ][];
};

const testCases: TestCaseMap = {
  float: [
    [0.5, null, null],
    [undefined, 0.5, "0.5"],
  ],
  float2: [
    [{ x: 0.5, y: 0.5 }, null, null],
    [undefined, { x: 0.5, y: 0.5 }, "[0.5;0.5]"],
  ],
  float3: [
    [{ x: 0.5, y: 0.5, z: 0.5 }, null, null],
    [undefined, { x: 0.5, y: 0.5, z: 0.5 }, "[0.5;0.5;0.5]"],
  ],
  float4: [
    [{ x: 0.5, y: 0.5, z: 0.5, w: 0.5 }, null, null],
    [undefined, { x: 0.5, y: 0.5, z: 0.5, w: 0.5 }, "[0.5;0.5;0.5;0.5]"],
  ],
  floatQ: [
    [{ x: 0.5, y: 0.5, z: 0.5 }, null, null],
    [undefined, { x: 0.5, y: 0.5, z: 0.5 }, "[0.5;0.5;0.5]"],
  ],
  color: [
    [{ r: 0.5, g: 0.5, b: 0.5, a: 0.5 }, null, null],
    [undefined, { r: 0.5, g: 0.5, b: 0.5, a: 0.5 }, "[0.5;0.5;0.5;0.5]"],
  ],
  string: [
    ["a", null, null],
    [
      undefined,
      "@@#!%R@EFG%$T@# TATERS!",
      "%40%40%23!%25R%40EFG%25%24T%40%23%20TATERS!",
    ],
    [undefined, "!@#$%^&*()_+-=", "!%40%23%24%25%5E%26*()_%2B-%3D"],
  ],
  bool: [
    [true, null, null],
    [undefined, true, "true"],
    [undefined, false, "false"],
  ],
};

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.map(([o, n, e]) => [k, o, n, e])
  )
)("%s should stringify %s to %s", (type, oldVal, newVal, expected) => {
  const diff = [] as any;
  (differs as any)[type as any](oldVal, newVal, {
    diff: (d: any) => diff.push(d),
  });
  expect(diff[0]).toStrictEqual({
    type: type,
    value: expected,
  });
});
