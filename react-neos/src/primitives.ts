import {
  PrimitiveDefinition,
  primitiveDefinitionsToUpdaters,
} from "./basePrimitives";

export type Vec4D = { x: number; y: number; z: number; w: number };

export type Vec3D = { x: number; y: number; z: number };

export type Vec2D = { x: number; y: number };

export type Color = { r: number; g: number; b: number; a?: number };

export const p = {
  xyzw(x: number, y: number, z: number, w: number): Vec4D {
    return { x, y, z, w };
  },
  xyz1(x: number, y: number, z: number): Vec4D {
    return { x, y, z, w: 1 };
  },
  xyz0(x: number, y: number, z: number): Vec4D {
    return { x, y, z, w: 0 };
  },
  xxxx(x: number): Vec4D {
    return { x, y: x, z: x, w: x };
  },
  xyz(x: number, y: number, z: number): Vec3D {
    return { x, y, z };
  },
  xxx(x: number): Vec3D {
    return { x, y: x, z: x };
  },
  xy(x: number, y: number): Vec2D {
    return { x, y };
  },
  xx(x: number): Vec2D {
    return { x, y: x };
  },
  rgba(r: number, g: number, b: number, a: number): Color {
    return { r, g, b, a };
  },
  rgb1(r: number, g: number, b: number): Color {
    return { r, g, b, a: 1 };
  },
  rrrr(r: number): Color {
    return { r, g: r, b: r, a: r };
  },
  rrr1(r: number): Color {
    return { r, g: r, b: r, a: 1 };
  },
};

const float: PrimitiveDefinition<number> = {
  stringify: (value) => value.toString(10),
  equals: (a, b) => a === b,
};

const float2: PrimitiveDefinition<Vec2D> = {
  stringify: (value) => `[${value.x};${value.y}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y,
};

const float3: PrimitiveDefinition<Vec3D> = {
  stringify: (value) => `[${value.x};${value.y};${value.z}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
};

const float4: PrimitiveDefinition<Vec4D> = {
  stringify: (value) => `[${value.x};${value.y};${value.z};${value.w}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w,
};

const color: PrimitiveDefinition<Color> = {
  stringify: (value) =>
    `[${value.r};${value.g};${value.b};${value.a !== undefined ? value.a : 1}]`,
  equals: (a, b) => a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a,
};

const floatQ: PrimitiveDefinition<Vec3D> = {
  stringify: (value) => `[${value.x};${value.y};${value.z}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
};

function normalizeString(value: string | Array<string>): string {
  if (Array.isArray(value)) {
    return value.join(" ");
  } else {
    return value;
  }
}

const string: PrimitiveDefinition<string | Array<string>> = {
  stringify: (value) => encodeURIComponent(normalizeString(value)),
  equals: (a, b) => normalizeString(a) === normalizeString(b),
};

const bool: PrimitiveDefinition<boolean> = {
  stringify: (value: boolean) => {
    return value ? "true" : "false";
  },
  equals: (a, b) => a === b,
};

const updaters = primitiveDefinitionsToUpdaters({
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
