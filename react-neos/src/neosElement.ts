import prim from "./primitives";
import {
  definitionsToUpdaters,
  updatersToElements,
  hasReactChildren,
  UpdatersToProps,
} from "./baseElements";

const baseElementDef = {
  active: prim.bool,
  persistent: prim.bool,
  name: prim.string,
  tag: prim.string,
};

const base3DElementDef = {
  ...baseElementDef,
  position: prim.float3,
  rotation: prim.floatQ,
  scale: prim.float3,
};

const base2DElementDef = {
  ...baseElementDef,
  anchorMin: prim.float2,
  anchorMax: prim.float2,
  offsetMin: prim.float2,
  offsetMax: prim.float2,
  pivot: prim.float2,
};

export const elementDefs = definitionsToUpdaters({
  transform: {
    ...base3DElementDef,
    ...hasReactChildren(),
  },
  smoothTransform: {
    ...base3DElementDef,
    ...hasReactChildren(),
    smoothTransformEnabled: prim.bool,
    smoothSpeed: prim.float,
  },
  spinner: {
    ...base3DElementDef,
    ...hasReactChildren(),
    speed: prim.float3,
    range: prim.float3,
  },
  box: {
    ...base3DElementDef,
    albedoColor: prim.color,
    emissiveColor: prim.color,
    size: prim.float3,
    colliderActive: prim.bool,
    characterCollider: prim.bool,
    ignoreRaycasts: prim.bool,
  },
  canvas: {
    ...base3DElementDef,
    ...hasReactChildren(),
  },
  rect: {
    ...base2DElementDef,
    ...hasReactChildren(),
  },
  image: {
    ...base2DElementDef,
    ...hasReactChildren(),
    color: prim.color,
  },
  horizontalLayout: {
    ...base2DElementDef,
    ...hasReactChildren(),
  },
  verticalLayout: {
    ...base2DElementDef,
    ...hasReactChildren(),
  },
  text: {
    ...base2DElementDef,
    children: prim.string,
    color: prim.color,
  },
  button: {
    ...base2DElementDef,
    ...hasReactChildren(),
  },
});

export type Props = UpdatersToProps<typeof elementDefs>;

export default updatersToElements(elementDefs);
