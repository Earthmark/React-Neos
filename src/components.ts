import prop from "./props";
import {
  hasReactChildren,
  elementPropsSetToTemplates,
  elementTemplatesToJsxPrototypes,
  ElementTemplateSetJsxSignatureLibrary,
} from "./componentsBase";

const baseComponentDef = {
  active: prop.bool.refField(),
  persistent: prop.bool.refField(),
  name: prop.string.refField(),
  tag: prop.string.refField(),
  self: prop.slot.ref(),
};

const base3DComponentDef = {
  ...baseComponentDef,
  position: prop.float3.refField(),
  rotation: prop.floatQ.refField(),
  scale: prop.float3.refField({ x: 1, y: 1, z: 1 }),
};

const base2DComponentDef = {
  ...baseComponentDef,
  anchorMin: prop.float2.refField(),
  anchorMax: prop.float2.refField(),
  offsetMin: prop.float2.refField(),
  offsetMax: prop.float2.refField(),
  pivot: prop.float2.refField(),
};

export const componentDefs = elementPropsSetToTemplates({
  transform: {
    ...base3DComponentDef,
    ...hasReactChildren(),
  },
  smoothTransform: {
    ...base3DComponentDef,
    ...hasReactChildren(),
    smoothTransformEnabled: prop.bool.refField(),
    smoothSpeed: prop.float.refField(),
  },
  spinner: {
    ...base3DComponentDef,
    ...hasReactChildren(),
    speed: prop.float3.refField(),
    range: prop.float3.refField(),
  },
  box: {
    ...base3DComponentDef,
    albedoColor: prop.color.refField(),
    emissiveColor: prop.color.refField(),
    size: prop.float3.refField({ x: 1, y: 1, z: 1 }),
    colliderActive: prop.bool.refField(),
    characterCollider: prop.bool.refField(),
    ignoreRaycasts: prop.bool.refField(),
  },
  meshRenderer: {
    ...base3DComponentDef,
    name: prop.string.refField(),
    tag: prop.string.refField(),
    mesh: prop.mesh.refField(),
    material: prop.material.refField(),
  },
  unlitMaterial: {
    name: prop.string.refField(),
    tag: prop.string.refField(),
    color: prop.color.refField(),
    self: prop.material.ref(),
  },
  boxMesh: {
    name: prop.string.refField(),
    tag: prop.string.refField(),
    self: prop.mesh.ref(),
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
    color: prop.color.refField(),
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
    children: prop.string.refField(),
    color: prop.color.refField(),
  },
  button: {
    ...base2DComponentDef,
    ...hasReactChildren(),
  },
  texture: {
    ...baseComponentDef,
    uri: prop.string.refField(),
  },
});

export type Props = ElementTemplateSetJsxSignatureLibrary<typeof componentDefs>;

export default elementTemplatesToJsxPrototypes(componentDefs);
