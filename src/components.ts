import prop from "./props";
import {
  definitionsToUpdaters,
  updatersToComponents,
  hasReactChildren,
  UpdatersToProps,
} from "./componentsBase";

const baseComponentDef = {
  active: prop.bool,
  persistent: prop.bool,
  name: prop.string,
  tag: prop.string,
};

const base3DComponentDef = {
  ...baseComponentDef,
  position: prop.float3,
  rotation: prop.floatQ,
  scale: prop.float3,
};

const base2DComponentDef = {
  ...baseComponentDef,
  anchorMin: prop.float2,
  anchorMax: prop.float2,
  offsetMin: prop.float2,
  offsetMax: prop.float2,
  pivot: prop.float2,
};

export const componentDefs = definitionsToUpdaters({
  transform: {
    ...base3DComponentDef,
    ...hasReactChildren(),
  },
  smoothTransform: {
    ...base3DComponentDef,
    ...hasReactChildren(),
    smoothTransformEnabled: prop.bool,
    smoothSpeed: prop.float,
  },
  spinner: {
    ...base3DComponentDef,
    ...hasReactChildren(),
    speed: prop.float3,
    range: prop.float3,
  },
  box: {
    ...base3DComponentDef,
    albedoColor: prop.color,
    emissiveColor: prop.color,
    size: prop.float3,
    colliderActive: prop.bool,
    characterCollider: prop.bool,
    ignoreRaycasts: prop.bool,
  },
  canvas: {
    ...base3DComponentDef,
    ...hasReactChildren(),
  },
  rect: {
    ...base2DComponentDef,
    ...hasReactChildren(),
  },
  image: {
    ...base2DComponentDef,
    ...hasReactChildren(),
    color: prop.color,
  },
  horizontalLayout: {
    ...base2DComponentDef,
    ...hasReactChildren(),
  },
  verticalLayout: {
    ...base2DComponentDef,
    ...hasReactChildren(),
  },
  text: {
    ...base2DComponentDef,
    children: prop.string,
    color: prop.color,
  },
  button: {
    ...base2DComponentDef,
    ...hasReactChildren(),
  },
});

export type Props = UpdatersToProps<typeof componentDefs>;

export default updatersToComponents(componentDefs);
