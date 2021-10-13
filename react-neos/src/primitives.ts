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

export type PrimitiveStandard<P> = P extends Primitive<unknown, infer S>
  ? S
  : never;
export type PrimitiveInput<P> = P extends Primitive<infer I, unknown>
  ? I
  : never;

interface Primitive<Input, StandardFormat = any> {
  normalize(value: Input): StandardFormat;
  stringify(value: StandardFormat): string;
  equals(a: StandardFormat, b: StandardFormat): boolean;
}

const float: Primitive<number, number> = {
  normalize: (value) => value,
  stringify: (value) => value.toString(10),
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
  stringify: (value) => `[${value[0]};${value[1]}]`,
  equals: (a, b) => a[0] === b[0] && a[1] === b[1],
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
  stringify: (value) => `[${value[0]};${value[1]};${value[2]}]`,
  equals: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2],
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
  stringify: (value) => `[${value[0]};${value[1]};${value[2]};${value[3]}]`,
  equals: (a, b) =>
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3],
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
  stringify: (value) =>
    `[${value[0]};${value[1]};${value[2]};${
      value[3] !== undefined ? value[3] : 1
    }]`,
  equals: (a, b) =>
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3],
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
  stringify: (value) => `[${value[0]};${value[1]};${value[2]}]`,
  equals: (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2],
};

const string: Primitive<string | Array<string>, string> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
      return value.join(" ");
    } else {
      return value;
    }
  },
  stringify: encodeURIComponent,
  equals: (a, b) => a === b,
};

const bool: Primitive<boolean, boolean> = {
  normalize: (value) => value,
  stringify: (value: boolean) => {
    return value ? "true" : "false";
  },
  equals: (a, b) => a === b,
};

type Optional<T> = T | null | undefined;

export type PropFunc<T> = (
  o: Optional<T>,
  n: Optional<T>,
  d: { diff(o: { type: string; value: string | null }): void }
) => void;

export function differ<Input, StandardFormat>(
  { normalize, equals, stringify }: Primitive<Input, StandardFormat>,
  o: Optional<Input>,
  n: Optional<Input>
): { value: string | null } | null {
  const hasO = o !== undefined && o !== null;
  const hasN = n !== undefined && n !== null;
  if ((hasO || hasN) && o !== n) {
    const no = hasO ? normalize(o) : null;
    const nn = hasN ? normalize(n) : null;
    if (no === null || nn === null || !equals(no, nn)) {
      return { value: nn !== null ? stringify(nn) : null };
    }
  }
  return null;
}

export function definitionsToUpdaters<Primitives>(primitiveBases: {
  [TypeName in keyof Primitives]: Primitive<Primitives[TypeName]>;
}): {
  [TypeName in keyof Primitives]: PropFunc<Primitives[TypeName]>;
} {
  const result: {
    [TypeName in keyof Primitives]?: PropFunc<Primitives[TypeName]>;
  } = {};
  for (const key in primitiveBases) {
    const base = primitiveBases[key];
    result[key] = (oldProp, newProp, delta) => {
      const difference = differ(base, oldProp, newProp);
      if (difference !== null) {
        delta.diff({
          ...difference,
          type: key,
        });
      }
    };
  }
  return result as any;
}

const updaters = definitionsToUpdaters({
  float,
  float2,
  float3,
  float4,
  floatQ,
  color,
  string,
  bool,
});

export default updaters;
