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
  normalize(value: Input): StandardFormat;
  stringify(value: StandardFormat | null): string;
  parse(value: string): StandardFormat | null;
  equals(a: StandardFormat, b: StandardFormat): boolean;
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

const float: Primitive<number, number> = {
  normalize: (value) => value,
  parse: handleParserNull((value) => parseFloat(value)),
  stringify: WrapStringify("float", (value) => value.toString(10)),
  equals: (a, b) => a === b,
};

const float2: Primitive<Vec2D, [number, number]> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
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
  stringify: WrapStringify("float2", (value) => `[${value[0]};${value[1]}]`),
  equals: (a, b) => {
    return a[0] === b[0] && a[1] === b[1];
  },
};

const float3: Primitive<Vec3D, [number, number, number]> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
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
    "float3",
    (value) => `[${value[0]};${value[1]};${value[2]}]`
  ),
  equals: (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  },
};

const float4: Primitive<Vec4D, [number, number, number, number]> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
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
    "float4",
    (value) => `[${value[0]};${value[1]};${value[2]};${value[3]}]`
  ),
  equals: (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  },
};

const color: Primitive<Color, [number, number, number, number]> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
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
    "color",
    (value) =>
      `[${value[0]};${value[1]};${value[2]};${
        value[3] !== undefined ? value[3] : 1
      }]`
  ),
  equals: (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  },
};

const floatQ: Primitive<Vec3D, [number, number, number]> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
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
    "floatQ",
    (value) => `[${value[0]};${value[1]};${value[2]}]`
  ),
  equals: (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  },
};

const string: Primitive<string | Array<string>, string> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
      return value.join(" ");
    } else {
      return value;
    }
  },
  parse: handleParserNull(decodeURIComponent),
  stringify: WrapStringify("string", encodeURIComponent),
  equals: (a, b) => a === b,
};

const bool: Primitive<boolean, boolean> = {
  normalize: (value) => value,
  parse: handleParserNull((value: string) => {
    return value === "true";
  }),
  stringify: WrapStringify("bool", (value: boolean) => {
    return value ? "true" : "false";
  }),
  equals: (a, b) => a === b,
};

type Optional<T> = T | null | undefined;

export type DiffFunc<T> = (o: Optional<T>, n: Optional<T>) => string | null;

export function differ<Input, StandardFormat>({
  normalize,
  equals,
  stringify,
}: {
  normalize: (input: Input) => StandardFormat;
  equals: (a: StandardFormat, b: StandardFormat) => boolean;
  stringify: (input: StandardFormat | null) => string;
}): DiffFunc<Input> {
  return (o, n) => {
    const hasO = o !== undefined && o !== null;
    const hasN = n !== undefined && n !== null;
    if ((hasO || hasN) && o !== n) {
      const no = hasO ? normalize(o) : null;
      const nn = hasN ? normalize(n) : null;
      if (no === null || nn === null || !equals(no, nn)) {
        return stringify(nn);
      }
    }
    return null;
  };
}

export const differs = {
  float: differ(float),
  float2: differ(float2),
  float3: differ(float3),
  float4: differ(float4),
  floatQ: differ(floatQ),
  color: differ(color),
  string: differ(string),
  bool: differ(bool),
};

export const parsers = {
  float: float.parse,
  float2: float2.parse,
  float3: float3.parse,
  float4: float4.parse,
  floatQ: floatQ.parse,
  color: color.parse,
  string: string.parse,
  bool: bool.parse,
};
