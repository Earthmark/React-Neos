import { Vec4D, Vec3D, Vec2D, Color } from "./BaseTypes";

type NullSymbol = "$";

export const nullSymbol: NullSymbol = "$";

export interface Parser<Input, Output> {
  stringify(value: Input | null): string;
  parse(value: string): Output | null;
}

const f: Parser<number, number> = {
  parse: WrapParser((value: string) => parseFloat(value)),
  stringify: WrapStringify("f", (value: number) => value.toString()),
};

const f2: Parser<Vec2D, [number, number]> = {
  parse: WrapParser((value: string) => {
    const trimmedVal = value.replace(/\[|\]/g, "");
    const [x, y] = trimmedVal.split(";").map(parseFloat);
    return [x, y];
  }),
  stringify: WrapStringify("f2", (value: Vec2D) => {
    if (Array.isArray(value)) {
      return `[${value[0]};${value[1]}]`;
    } else if (typeof value === "object") {
      return `[${value.x};${value.y}]`;
    } else {
      return `[${value};${value}]`;
    }
  }),
};

const f3: Parser<Vec3D, [number, number, number]> = {
  parse: WrapParser((value: string) => {
    const trimmedVal = value.replace(/\[|\]/g, "");
    const [x, y, z] = trimmedVal.split(";").map(parseFloat);
    return [x, y, z];
  }),
  stringify: WrapStringify("f3", (value: Vec3D) => {
    if (Array.isArray(value)) {
      return `[${value[0]};${value[1]};${value[2]}]`;
    } else if (typeof value === "object") {
      return `[${value.x};${value.y};${value.z}]`;
    } else {
      return `[${value};${value};${value}]`;
    }
  }),
};

const f4: Parser<Vec4D, [number, number, number, number]> = {
  parse: WrapParser((value: string) => {
    const trimmedVal = value.replace(/\[|\]/g, "");
    const [x, y, z, w] = trimmedVal.split(";").map(parseFloat);
    return [x, y, z, w];
  }),
  stringify: WrapStringify("f4", (value: Vec4D) => {
    if (Array.isArray(value)) {
      return `[${value[0]};${value[1]};${value[2]};${value[3]}]`;
    } else if (typeof value === "object") {
      return `[${value.x};${value.y};${value.z};${value.w}]`;
    } else {
      return `[${value};${value};${value};${value}]`;
    }
  }),
};

const c: Parser<Color, [number, number, number, number]> = {
  parse: WrapParser((value: string) => {
    const trimmedVal = value.replace(/\[|\]/g, "");
    const [x, y, z, w] = trimmedVal.split(";").map(parseFloat);
    return [x, y, z, w];
  }),
  stringify: WrapStringify("c", (value: Vec4D) => {
    if (Array.isArray(value)) {
      return `[${value[0]};${value[1]};${value[2]};${
        value[3] !== undefined ? value[3] : 1
      }]`;
    } else if (typeof value === "object") {
      return `[${value.x};${value.y};${value.z};${value.w}]`;
    } else {
      return `[${value};${value};${value};1]`;
    }
  }),
};

const fq: Parser<Vec3D, [number, number, number]> = {
  parse: WrapParser((value: string) => {
    const trimmedVal = value.replace(/\[|\]/g, "");
    const [x, y, z] = trimmedVal.split(";").map(parseFloat);
    return [x, y, z];
  }),
  stringify: WrapStringify("fq", (value: Vec3D) => {
    if (Array.isArray(value)) {
      // TODO: This needs to convert to quants.
      return `[${value[0]};${value[1]};${value[2]}]`;
    } else if (typeof value === "object") {
      return `[${value.x};${value.y};${value.z}]`;
    } else {
      return `[${value};${value};${value}]`;
    }
  }),
};

const s: Parser<string, string> = {
  parse: WrapParser((value: string) => {
    return decodeURIComponent(value);
  }),
  stringify: WrapStringify("s", (value: string) => {
    return encodeURIComponent(value);
  }),
};

function WrapParser<Output>(
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
  return (value: Input | null) => {
    if (value === null) {
      return prefix + "#" + nullSymbol;
    }
    return prefix + "#" + inner(value);
  };
}

const Parsers = {
  f: f,
  f2: f2,
  f3: f3,
  f4: f4,
  fq: fq,
  c: c,
  s: s,
};

export default Parsers;
