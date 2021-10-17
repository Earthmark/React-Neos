import differs, { p } from "./primitives";

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
    [p.xx(0.5), null, null],
    [undefined, p.xx(0.5), "[0.5;0.5]"],
  ],
  float3: [
    [p.xxx(0.5), null, null],
    [undefined, p.xxx(0.5), "[0.5;0.5;0.5]"],
  ],
  float4: [
    [p.xxxx(0.5), null, null],
    [undefined, p.xxxx(0.5), "[0.5;0.5;0.5;0.5]"],
  ],
  floatQ: [
    [p.xxx(0.5), null, null],
    [undefined, p.xxx(0.5), "[0.5;0.5;0.5]"],
  ],
  color: [
    [p.rrrr(0.5), null, null],
    [undefined, p.rrrr(0.5), "[0.5;0.5;0.5;0.5]"],
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
