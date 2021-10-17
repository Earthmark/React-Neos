import prop from "./props";
import {
  definitionsToUpdaters,
  updatersToElements,
  hasReactChildren,
  UpdatersToProps,
} from "./componentsBase";

const baseElementDef = {
  active: prop.bool,
  persistent: prop.bool,
  name: prop.string,
  tag: prop.string,
};

const base3DElementDef = {
  ...baseElementDef,
  position: prop.float3,
  rotation: prop.floatQ,
  scale: prop.float3,
};

const base2DElementDef = {
  ...baseElementDef,
  anchorMin: prop.float2,
  anchorMax: prop.float2,
  offsetMin: prop.float2,
  offsetMax: prop.float2,
  pivot: prop.float2,
};

export const elementDefs = definitionsToUpdaters({
  transform: {
    ...base3DElementDef,
    ...hasReactChildren(),
  },
  smoothTransform: {
    ...base3DElementDef,
    ...hasReactChildren(),
    smoothTransformEnabled: prop.bool,
    smoothSpeed: prop.float,
  },
  spinner: {
    ...base3DElementDef,
    ...hasReactChildren(),
    speed: prop.float3,
    range: prop.float3,
  },
  box: {
    ...base3DElementDef,
    albedoColor: prop.color,
    emissiveColor: prop.color,
    size: prop.float3,
    colliderActive: prop.bool,
    characterCollider: prop.bool,
    ignoreRaycasts: prop.bool,
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
    color: prop.color,
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
    children: prop.string,
    color: prop.color,
  },
  button: {
    ...base2DElementDef,
    ...hasReactChildren(),
  },
});

export type Props = UpdatersToProps<typeof elementDefs>;

export default updatersToElements(elementDefs);
