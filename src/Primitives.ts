type ObjectVec4D = { x: number; y: number; z: number; w: number };
type ArrayVec4D = [number, number, number, number];
type SingleTVec4D = number;
export type Vec4D = ObjectVec4D | ArrayVec4D | SingleTVec4D;

type ObjectVec3D = { x: number; y: number; z: number };
type ArrayVec3D = [number, number, number];
type SingleTVec3D = number;
export type Vec3D = ObjectVec3D | ArrayVec3D | SingleTVec3D;

type ObjectVec2D = { x: number; y: number };
type ArrayVec2D = [number, number];
type SingleTVec2D = number;
export type Vec2D = ObjectVec2D | ArrayVec2D | SingleTVec2D;

// A single number is interpreted as a vec4.
export type Color = Vec4D | Vec3D;

export const nullSymbol: "$" = "$";

export type PrimitiveStandard<P> = P extends Primitive<unknown, infer S>
  ? S
  : never;
export type PrimitiveInput<P> = P extends Primitive<infer I, unknown>
  ? I
  : never;

interface Primitive<Input, StandardFormat> {
  normalize(value: Input | null): StandardFormat | null;
  stringify(value: StandardFormat | null): string;
  parse(value: string): StandardFormat | null;
  equals(a: StandardFormat | null, b: StandardFormat | null): boolean;
}

function parseVector(value: string): Array<number> {
  const trimmedVal = value.replace(/\[|\]/g, "");
  return trimmedVal.split(";").map(parseFloat);
}

function handleParserNull<Output>(
  inner: (value: string) => Output
): (value: string) => Output | null {
  return (value: string) => {
    if (value === nullSymbol) {
      return null;
    }
    return inner(value);
  };
}

const f: Primitive<number, number> = {
  normalize: (value) => value,
  parse: handleParserNull((value) => parseFloat(value)),
  stringify: WrapStringify("f", (value) => value.toString(10)),
  equals: (a, b) => a === b,
};

const f2: Primitive<Vec2D, [number, number]> = {
  normalize: (value) => {
    if (value === null) {
      return null;
    } else if (Array.isArray(value)) {
      return value;
    } else if (typeof value === "object") {
      return [value.x, value.y];
    } else {
      return [value, value];
    }
  },
  parse: handleParserNull((value: string) => {
    const [x, y] = parseVector(value);
    return [x, y];
  }),
  stringify: WrapStringify("f2", (value) => `[${value[0]};${value[1]}]`),
  equals: (a, b) => {
    if (a === null && b === null) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    return a[0] === b[0] && a[1] === b[1];
  },
};

const f3: Primitive<Vec3D, [number, number, number]> = {
  normalize: (value) => {
    if (value === null) {
      return null;
    } else if (Array.isArray(value)) {
      return value;
    } else if (typeof value === "object") {
      return [value.x, value.y, value.z];
    } else {
      return [value, value, value];
    }
  },
  parse: handleParserNull((value) => {
    const [x, y, z] = parseVector(value);
    return [x, y, z];
  }),
  stringify: WrapStringify(
    "f3",
    (value) => `[${value[0]};${value[1]};${value[2]}]`
  ),
  equals: (a, b) => {
    if (a === null && b === null) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  },
};

const f4: Primitive<Vec4D, [number, number, number, number]> = {
  normalize: (value) => {
    if (value === null) {
      return null;
    } else if (Array.isArray(value)) {
      return value;
    } else if (typeof value === "object") {
      return [value.x, value.y, value.z, value.w];
    } else {
      return [value, value, value, value];
    }
  },
  parse: handleParserNull((value: string) => {
    const [x, y, z, w] = parseVector(value);
    return [x, y, z, w];
  }),
  stringify: WrapStringify(
    "f4",
    (value) => `[${value[0]};${value[1]};${value[2]};${value[3]}]`
  ),
  equals: (a, b) => {
    if (a === null && b === null) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  },
};

const c: Primitive<Color, [number, number, number, number]> = {
  normalize: (value) => {
    if (value === null) {
      return null;
    } else if (Array.isArray(value)) {
      return value.length == 3 ? [...value, 1] : value;
    } else if (typeof value === "object") {
      return [value.x, value.y, value.z, 1];
    } else {
      return [value, value, value, 1];
    }
  },
  parse: handleParserNull((value) => {
    const [x, y, z, w] = parseVector(value);
    return [x, y, z, w];
  }),
  stringify: WrapStringify(
    "c",
    (value) =>
      `[${value[0]};${value[1]};${value[2]};${
        value[3] !== undefined ? value[3] : 1
      }]`
  ),
  equals: (a, b) => {
    if (a === null && b === null) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  },
};

const fq: Primitive<Vec3D, [number, number, number]> = {
  normalize: (value) => {
    if (value === null) {
      return null;
    } else if (Array.isArray(value)) {
      return value;
    } else if (typeof value === "object") {
      return [value.x, value.y, value.z];
    } else {
      return [value, value, value];
    }
  },
  parse: handleParserNull((value) => {
    const [x, y, z] = parseVector(value);
    return [x, y, z];
  }),
  stringify: WrapStringify(
    "fq",
    (value) => `[${value[0]};${value[1]};${value[2]}]`
  ),
  equals: (a, b) => {
    if (a === null && b === null) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  },
};

const s: Primitive<string | Array<string>, string> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
      return value.join(" ");
    } else {
      return value;
    }
  },
  parse: handleParserNull(decodeURIComponent),
  stringify: WrapStringify("s", encodeURIComponent),
  equals: (a, b) => a === b,
};

const b: Primitive<boolean, boolean> = {
  normalize: (value) => value,
  parse: handleParserNull((value: string) => {
    return value === "true";
  }),
  stringify: WrapStringify("b", (value: boolean) => {
    return value ? "true" : "false";
  }),
  equals: (a, b) => a === b,
};

function WrapStringify<Input>(
  prefix: string,
  inner: (value: Input) => string
): (value: Input | null) => string {
  const appendPrefix = prefix + "#";
  const nullValue = appendPrefix + nullSymbol;
  return (value: Input | null) => {
    if (value === null) {
      return nullValue;
    }
    return appendPrefix + inner(value);
  };
}

type DeltaSolver<Parser> = (
  oldProp: PrimitiveInput<Parser> | null | undefined,
  newProp: PrimitiveInput<Parser> | null | undefined
) => string | null;

function CalculateDelta<
  Input,
  StandardFormat,
  Parser extends Primitive<Input, StandardFormat>
>(parser: Parser): DeltaSolver<Parser> {
  return (oldProp, newProp) => {
    const oldValue = oldProp === undefined ? null : parser.normalize(oldProp);
    const newValue = newProp === undefined ? null : parser.normalize(newProp);
    if (!parser.equals(oldValue, newValue)) {
      return parser.stringify(newValue);
    }
    return null;
  };
}

export const DeltaSolver = {
  f: CalculateDelta(f),
  f2: CalculateDelta(f2),
  f3: CalculateDelta(f3),
  f4: CalculateDelta(f4),
  fq: CalculateDelta(fq),
  c: CalculateDelta(c),
  s: CalculateDelta(s),
  b: CalculateDelta(b),
};

const Parsers = {
  f: f.parse,
  f2: f2.parse,
  f3: f3.parse,
  f4: f4.parse,
  fq: fq.parse,
  c: c.parse,
  s: s.parse,
  b: b.parse,
};
