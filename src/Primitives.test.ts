import { differs, nullSymbol, PrimitiveStandard } from "./Primitives";

type DifferInput<T> = T extends (
  oldProps: infer Arg,
  newProps: infer Arg
) => unknown
  ? Arg
  : never;

type TestCaseMap = {
  [key in keyof typeof differs]: {
    str: [
      DifferInput<typeof differs[key]>,
      DifferInput<typeof differs[key]>,
      string | null
    ][];
    par: [string, PrimitiveStandard<typeof differs[key]> | null][];
  };
};

const testCases: TestCaseMap = {
  float: {
    str: [
      [0.5, null, "float#" + nullSymbol],
      [undefined, 0.5, "float#0.5"],
    ],
    par: [
      // ["0.5", 0.5],
      [nullSymbol, null],
    ],
  },
  float2: {
    str: [
      [0.5, null, "float2#" + nullSymbol],
      [undefined, [0.5, 0.5], "float2#[0.5;0.5]"],
    ],
    par: [
      // ["[0.5;0.5]", [0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  float3: {
    str: [
      [0.5, null, "float3#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5], "float3#[0.5;0.5;0.5]"],
    ],
    par: [
      // ["[0.5;0.5;0.5]", [0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  float4: {
    str: [
      [0.5, null, "float4#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5, 0.5], "float4#[0.5;0.5;0.5;0.5]"],
    ],
    par: [
      // ["[0.5;0.5;0.5;0.5]", [0.5, 0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  floatQ: {
    str: [
      [0.5, null, "floatQ#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5], "floatQ#[0.5;0.5;0.5]"],
    ],
    par: [
      //["[0.5;0.5;0.5]", [0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  color: {
    str: [
      [0.5, null, "color#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5, 0.5], "color#[0.5;0.5;0.5;0.5]"],
    ],
    par: [
      //["[0.5;0.5;0.5;0.5]", [0.5, 0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  string: {
    str: [
      ["a", null, "string#" + nullSymbol],
      [
        undefined,
        "@@#!%R@EFG%$T@# TATERS!",
        "string#%40%40%23!%25R%40EFG%25%24T%40%23%20TATERS!",
      ],
      [undefined, "!@#$%^&*()_+-=", "string#!%40%23%24%25%5E%26*()_%2B-%3D"],
    ],
    par: [
      // [
      //  "!%40%23%25%5E%20Welcome%20to%20taco%20land",
      //  "!@#%^ Welcome to taco land",
      // ],
      [nullSymbol, null],
    ],
  },
  bool: {
    str: [
      [true, null, "bool#" + nullSymbol],
      [undefined, true, "bool#true"],
      [undefined, false, "bool#false"],
    ],
    par: [
      // ["true", true],
      // ["false", false],
      [nullSymbol, null],
    ],
  },
};

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.str.map(([o, n, e]) => [k, o, n, e])
  )
)("%s should stringify %s to %s", (type, oldVal, newVal, expected) => {
  expect((differs as any)[type as any](oldVal, newVal)).toStrictEqual(expected);
});

/*
it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.par.map(([i, o]) => [k, i, o])
  )
)("%s should parse %s to %s", (type, input, expected) => {
  expect((Primitives as any)[type as any].parse(input)).toStrictEqual(expected);
});
*/
