import {
  PrimitiveDefinition,
  primitiveDefinitionsToUpdaters,
} from "./basePrimitives";

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

const float: PrimitiveDefinition<number, number> = {
  normalize: (value) => value,
  stringify: (value) => value.toString(10),
  equals: (a, b) => a === b,
};

const float2: PrimitiveDefinition<Vec2D, [number, number]> = {
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

const float3: PrimitiveDefinition<Vec3D, [number, number, number]> = {
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

const float4: PrimitiveDefinition<Vec4D, [number, number, number, number]> = {
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

const color: PrimitiveDefinition<Color, [number, number, number, number]> = {
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

const floatQ: PrimitiveDefinition<Vec3D, [number, number, number]> = {
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

const string: PrimitiveDefinition<string | Array<string>, string> = {
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

const bool: PrimitiveDefinition<boolean, boolean> = {
  normalize: (value) => value,
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
