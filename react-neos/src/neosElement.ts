import p from "./primitives";
import {
  definitionsToUpdaters,
  updatersToElements,
  hasReactChildren,
  UpdatersToProps,
} from "./baseElements";

const baseElementDef = {
  active: p.bool,
  persistent: p.bool,
  name: p.string,
  tag: p.string,
};

const base3DElementDef = {
  ...baseElementDef,
  position: p.float3,
  rotation: p.floatQ,
  scale: p.float3,
};

const base2DElementDef = {
  ...baseElementDef,
  anchorMin: p.float2,
  anchorMax: p.float2,
  offsetMin: p.float2,
  offsetMax: p.float2,
  pivot: p.float2,
};

export const elementDefs = definitionsToUpdaters({
  transform: {
    ...base3DElementDef,
    ...hasReactChildren(),
  },
  smoothTransform: {
    ...base3DElementDef,
    ...hasReactChildren(),
    smoothTransformEnabled: p.bool,
    smoothSpeed: p.float,
  },
  spinner: {
    ...base3DElementDef,
    ...hasReactChildren(),
    speed: p.float3,
    range: p.float3,
  },
  box: {
    ...base3DElementDef,
    albedoColor: p.color,
    emissiveColor: p.color,
    size: p.float3,
    colliderActive: p.bool,
    characterCollider: p.bool,
    ignoreRaycasts: p.bool,
  },
  canvas: {
    ...base3DElementDef,
  },
  rect: {
    ...base2DElementDef,
  },
  text: {
    ...base2DElementDef,
    children: p.string,
  },
  button: {
    ...base2DElementDef,
  },
});

export type Props = UpdatersToProps<typeof elementDefs>;

export default updatersToElements(elementDefs);
