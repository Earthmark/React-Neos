import { PropDefinition, propDefinitionsToUpdaters } from "./propsBase";

export type Vec4D = Partial<{ x: number; y: number; z: number; w: number }>;

export type Vec3D = Partial<{ x: number; y: number; z: number }>;

export type Vec2D = Partial<{ x: number; y: number }>;

export type Color = Partial<{ r: number; g: number; b: number; a: number }>;

const float: PropDefinition<number, number> = {
  normalize: (value) => value,
  stringify: (value) => value.toString(10),
  equals: (a, b) => a === b,
};

const float2: PropDefinition<Vec2D, Required<Vec2D>> = {
  normalize: (value) => ({ x: value.x ?? 0, y: value.y ?? 0 }),
  stringify: (value) => `[${value.x};${value.y}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y,
};

const float3: PropDefinition<Vec3D, Required<Vec3D>> = {
  normalize: (value) => ({ x: value.x ?? 0, y: value.y ?? 0, z: value.z ?? 0 }),
  stringify: (value) => `[${value.x};${value.y};${value.z}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
};

const float4: PropDefinition<Vec4D, Required<Vec4D>> = {
  normalize: (value) => ({
    x: value.x ?? 0,
    y: value.y ?? 0,
    z: value.z ?? 0,
    w: value.w ?? 0,
  }),
  stringify: (value) => `[${value.x};${value.y};${value.z};${value.w}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w,
};

const color: PropDefinition<Color, Required<Color>> = {
  normalize: (value) => ({
    r: value.r ?? 0,
    g: value.g ?? 0,
    b: value.b ?? 0,
    a: value.a ?? 1,
  }),
  stringify: (value) => `[${value.r};${value.g};${value.b};${value.a}]`,
  equals: (a, b) => a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a,
};

const floatQ: PropDefinition<Vec3D, Required<Vec3D>> = {
  normalize: (value) => ({ x: value.x ?? 0, y: value.y ?? 0, z: value.z ?? 0 }),
  stringify: (value) => `[${value.x};${value.y};${value.z}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
};

const string: PropDefinition<string | Array<string | undefined>, string> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
      return value.filter(v => v).join(" ");
    } else {
      return value;
    }
  },
  stringify: (value) => encodeURIComponent(value),
  equals: (a, b) => a === b,
};

const bool: PropDefinition<boolean, boolean> = {
  normalize: (value) => value,
  stringify: (value: boolean) => {
    return value ? "true" : "false";
  },
  equals: (a, b) => a === b,
};

export default propDefinitionsToUpdaters({
  float,
  float2,
  float3,
  float4,
  floatQ,
  color,
  string,
  bool,
});
