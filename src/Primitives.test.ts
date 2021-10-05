import { DeltaSolver, nullSymbol, PrimitiveStandard } from "./Primitives";

type DifferInput<T> = T extends (
  oldProps: infer Arg,
  newProps: infer Arg
) => unknown
  ? Arg
  : never;

type TestCaseMap = {
  [key in keyof typeof DeltaSolver]: {
    str: [
      DifferInput<typeof DeltaSolver[key]>,
      DifferInput<typeof DeltaSolver[key]>,
      string | null
    ][];
    par: [string, PrimitiveStandard<typeof DeltaSolver[key]> | null][];
  };
};

const testCases: TestCaseMap = {
  f: {
    str: [
      [0.5, null, "f#" + nullSymbol],
      [undefined, 0.5, "f#0.5"],
    ],
    par: [
      // ["0.5", 0.5],
      [nullSymbol, null],
    ],
  },
  f2: {
    str: [
      [0.5, null, "f2#" + nullSymbol],
      [undefined, [0.5, 0.5], "f2#[0.5;0.5]"],
    ],
    par: [
      // ["[0.5;0.5]", [0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  f3: {
    str: [
      [0.5, null, "f3#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5], "f3#[0.5;0.5;0.5]"],
    ],
    par: [
      // ["[0.5;0.5;0.5]", [0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  f4: {
    str: [
      [0.5, null, "f4#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5, 0.5], "f4#[0.5;0.5;0.5;0.5]"],
    ],
    par: [
      // ["[0.5;0.5;0.5;0.5]", [0.5, 0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  fq: {
    str: [
      [0.5, null, "fq#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5], "fq#[0.5;0.5;0.5]"],
    ],
    par: [
      //["[0.5;0.5;0.5]", [0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  c: {
    str: [
      [0.5, null, "c#" + nullSymbol],
      [undefined, [0.5, 0.5, 0.5, 0.5], "c#[0.5;0.5;0.5;0.5]"],
    ],
    par: [
      //["[0.5;0.5;0.5;0.5]", [0.5, 0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  s: {
    str: [
      ["a", null, "s#" + nullSymbol],
      [
        undefined,
        "@@#!%R@EFG%$T@# TATERS!",
        "s#%40%40%23!%25R%40EFG%25%24T%40%23%20TATERS!",
      ],
      [undefined, "!@#$%^&*()_+-=", "s#!%40%23%24%25%5E%26*()_%2B-%3D"],
    ],
    par: [
      // [
      //  "!%40%23%25%5E%20Welcome%20to%20taco%20land",
      //  "!@#%^ Welcome to taco land",
      // ],
      [nullSymbol, null],
    ],
  },
  b: {
    str: [
      [true, null, "b#" + nullSymbol],
      [undefined, true, "b#true"],
      [undefined, false, "b#false"],
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
  expect((DeltaSolver as any)[type as any](oldVal, newVal)).toStrictEqual(
    expected
  );
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
