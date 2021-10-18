import { PropDefinition, propDefinitionsToUpdaters } from "./propsBase";

export type Vec4D = Partial<{ x: number; y: number; z: number; w: number }>;

export type Vec3D = Partial<{ x: number; y: number; z: number }>;

export type Vec2D = Partial<{ x: number; y: number }>;

export type Color = Partial<{ r: number; g: number; b: number; a: number }>;

const float: PropDefinition<number> = {
  stringify: (value) => value.toString(10),
  equals: (a, b) => a === b,
};

const float2: PropDefinition<Vec2D> = {
  stringify: (value) => `[${value.x ?? 0};${value.y ?? 0}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y,
};

const float3: PropDefinition<Vec3D> = {
  stringify: (value) => `[${value.x ?? 0};${value.y ?? 0};${value.z ?? 0}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
};

const float4: PropDefinition<Vec4D> = {
  stringify: (value) =>
    `[${value.x ?? 0};${value.y ?? 0};${value.z ?? 0};${value.w ?? 0}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w,
};

const color: PropDefinition<Color> = {
  stringify: (value) =>
    `[${value.r ?? 0};${value.g ?? 0};${value.b ?? 0};${value.a ?? 1}]`,
  equals: (a, b) => a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a,
};

const floatQ: PropDefinition<Vec3D> = {
  stringify: (value) => `[${value.x ?? 0};${value.y ?? 0};${value.z ?? 0}]`,
  equals: (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
};

function normalizeString(value: string | Array<string>): string {
  if (Array.isArray(value)) {
    return value.join(" ");
  } else {
    return value;
  }
}

const string: PropDefinition<string | Array<string>> = {
  stringify: (value) => encodeURIComponent(normalizeString(value)),
  equals: (a, b) => normalizeString(a) === normalizeString(b),
};

const bool: PropDefinition<boolean> = {
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
