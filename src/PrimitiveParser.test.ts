import Parsers, { nullSymbol, Parser } from "./PrimitiveParser";

type ParserOutput<P> = P extends Parser<unknown, infer O> ? O : never;
type ParserInput<P> = P extends Parser<infer I, unknown> ? I : never;

type TestCaseMap = {
  [key in keyof typeof Parsers]: {
    str: [ParserInput<typeof Parsers[key]> | null, string][];
    par: [string, ParserOutput<typeof Parsers[key]> | null][];
  };
};

const testCases: TestCaseMap = {
  f: {
    str: [
      [null, "f#" + nullSymbol],
      [0.5, "f#0.5"],
    ],
    par: [
      ["0.5", 0.5],
      [nullSymbol, null],
    ],
  },
  f2: {
    str: [
      [null, "f2#" + nullSymbol],
      [[0.5, 0.5], "f2#[0.5;0.5]"],
    ],
    par: [
      ["[0.5;0.5]", [0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  f3: {
    str: [
      [null, "f3#" + nullSymbol],
      [[0.5, 0.5, 0.5], "f3#[0.5;0.5;0.5]"],
    ],
    par: [
      ["[0.5;0.5;0.5]", [0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  f4: {
    str: [
      [null, "f4#" + nullSymbol],
      [[0.5, 0.5, 0.5, 0.5], "f4#[0.5;0.5;0.5;0.5]"],
    ],
    par: [
      ["[0.5;0.5;0.5;0.5]", [0.5, 0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  fq: {
    str: [
      [null, "fq#" + nullSymbol],
      [[0.5, 0.5, 0.5], "fq#[0.5;0.5;0.5]"],
    ],
    par: [
      ["[0.5;0.5;0.5]", [0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  c: {
    str: [
      [null, "c#" + nullSymbol],
      [[0.5, 0.5, 0.5, 0.5], "c#[0.5;0.5;0.5;0.5]"],
    ],
    par: [
      ["[0.5;0.5;0.5;0.5]", [0.5, 0.5, 0.5, 0.5]],
      [nullSymbol, null],
    ],
  },
  s: {
    str: [
      [null, "s#" + nullSymbol],
      [
        "@@#!%R@EFG%$T@# TATERS!",
        "s#%40%40%23!%25R%40EFG%25%24T%40%23%20TATERS!",
      ],
    ],
    par: [
      [
        "!%40%23%25%5E%20Welcome%20to%20taco%20land",
        "!@#%^ Welcome to taco land",
      ],
      [nullSymbol, null],
    ],
  },
};

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.str.map(([i, o]) => [k, i, o])
  )
)("%s should stringify %s to %s", (type, input, expected) => {
  expect((Parsers as any)[type as any].stringify(input)).toEqual(expected);
});

it.each(
  Object.entries(testCases).flatMap(([k, v]) =>
    v.par.map(([i, o]) => [k, i, o])
  )
)("%s should parse %s to %s", (type, input, expected) => {
  expect((Parsers as any)[type as any].parse(input)).toEqual(expected);
});
