import { PropDefinition, propDefinitionsToUpdaters } from "./propsBase";

const int: PropDefinition<number, number> = {
  normalize: (value) => Math.floor(value),
  stringify: (value) => value.toString(10),
  equals: (a, b) => a === b,
};

const float: PropDefinition<number, number> = {
  normalize: (value) => value,
  stringify: (value) => value.toString(10),
  equals: (a, b) => a === b,
};

interface V2<Value> {
  x: Value,
  y: Value
}

function v2<CompInput, CompNormalized>(d: PropDefinition<CompInput, CompNormalized>, def: V2<CompNormalized>)
: PropDefinition<Partial<V2<CompInput>>, V2<CompNormalized>> {
  return {
    normalize: (value) => ({
      x: value.x !== undefined ? d.normalize(value.x) : def.x,
      y: value.y !== undefined ? d.normalize(value.y) : def.y,
    }),
    stringify: (value) => `[${d.stringify(value.x)};${d.stringify(value.y)}]`,
    equals: (a, b) =>
      d.equals(a.x, b.x) &&
      d.equals(a.y, b.y)
  }
}

interface V3<Value> {
  x: Value,
  y: Value,
  z: Value
}

function v3<CompInput, CompNormalized>(d: PropDefinition<CompInput, CompNormalized>, def: V3<CompNormalized>)
: PropDefinition<Partial<V3<CompInput>>, V3<CompNormalized>> {
  return {
    normalize: (value) => ({
      x: value.x !== undefined ? d.normalize(value.x) : def.x,
      y: value.y !== undefined ? d.normalize(value.y) : def.y,
      z: value.z !== undefined ? d.normalize(value.z) : def.z,
    }),
    stringify: (value) => `[${d.stringify(value.x)};${d.stringify(value.y)};${d.stringify(value.z)}]`,
    equals: (a, b) =>
      d.equals(a.x, b.x) &&
      d.equals(a.y, b.y) &&
      d.equals(a.z, b.z)
  }
}

interface V4<Value> {
  x: Value,
  y: Value,
  z: Value,
  w: Value,
}

function v4<CompInput, CompNormalized>(d: PropDefinition<CompInput, CompNormalized>, def: V4<CompNormalized>)
: PropDefinition<Partial<V4<CompInput>>, V4<CompNormalized>> {
  return {
    normalize: (value) => ({
      x: value.x !== undefined ? d.normalize(value.x) : def.x,
      y: value.y !== undefined ? d.normalize(value.y) : def.y,
      z: value.z !== undefined ? d.normalize(value.z) : def.z,
      w: value.w !== undefined ? d.normalize(value.w) : def.w,
    }),
    stringify: (value) => `[${d.stringify(value.x)};${d.stringify(value.y)};${d.stringify(value.z)};${d.stringify(value.w)}]`,
    equals: (a, b) => 
      d.equals(a.x, b.x) &&
      d.equals(a.y, b.y) &&
      d.equals(a.z, b.z) &&
      d.equals(a.w, b.w)
  }
}

interface C4<Value> {
  r: Value,
  g: Value,
  b: Value,
  a: Value,
}

function c4<CompInput, CompNormalized>(d: PropDefinition<CompInput, CompNormalized>, def: C4<CompNormalized>)
: PropDefinition<Partial<C4<CompInput>>, C4<CompNormalized>> {
  return {
    normalize: (value) => ({
      r: value.r !== undefined ? d.normalize(value.r) : def.r,
      g: value.g !== undefined ? d.normalize(value.g) : def.g,
      b: value.b !== undefined ? d.normalize(value.b) : def.b,
      a: value.a !== undefined ? d.normalize(value.a) : def.a,
    }),
    stringify: (value) => `[${d.stringify(value.r)};${d.stringify(value.g)};${d.stringify(value.b)};${d.stringify(value.a)}]`,
    equals: (a, b) => d.equals(a.r, b.r) && d.equals(a.g, b.g) && d.equals(a.b, b.b) && d.equals(a.a, b.a)
  }
}

const int2 = v2(int, {x: 0, y: 0});
const int3 = v3(int, {x: 0, y: 0, z: 0});
const int4 = v4(int, {x: 0, y: 0, z: 0, w:0});

const float2 = v2(float, {x: 0, y: 0});
const float3 = v3(float, {x: 0, y: 0, z: 0});
const float4 = v4(float, {x: 0, y: 0, z: 0, w: 0});

const color = c4(float, {r: 0, g:0, b: 0, a: 1});

const floatQ = v3(float, {x: 0, y: 0, z: 0});

const string: PropDefinition<string | Array<string | undefined>, string> = {
  normalize: (value) => {
    if (Array.isArray(value)) {
      return value.filter(v => v !== undefined && v !== "").join(" ");
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
  int,
  int2,
  int3,
  int4,
  float,
  float2,
  float3,
  float4,
  floatQ,
  color,
  string,
  bool,
});
