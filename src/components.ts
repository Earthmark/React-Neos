import prop from "./props";
import {
  elementPropsToUpdater,
  elementPropsToTemplate,
  hasReactChildren,
  elementPropsSetToTemplates,
  elementTemplatesToJsxPrototypes,
  ElementTemplateSetJsxSignatureLibrary,
} from "./componentsBase";

const baseComponentDef = {
  active: prop.bool.field(),
  persistent: prop.bool.field(),
  name: prop.string.field(),
  tag: prop.string.field(),
};

const base3DComponentDef = {
  ...baseComponentDef,
  position: prop.float3.field(),
  rotation: prop.floatQ.field(),
  scale: prop.float3.field({ x: 1, y: 1, z: 1 }),
};

const base2DComponentDef = {
  ...baseComponentDef,
  anchorMin: prop.float2.field(),
  anchorMax: prop.float2.field(),
  offsetMin: prop.float2.field(),
  offsetMax: prop.float2.field(),
  pivot: prop.float2.field(),
};

export const componentDefs = {
  transform: elementPropsToTemplate({
    ...base3DComponentDef,
    ...hasReactChildren(),
  }),
  smoothTransform: elementPropsToTemplate({
    ...base3DComponentDef,
    ...hasReactChildren(),
    smoothTransformEnabled: prop.bool.field(),
    smoothSpeed: prop.float.field(),
  }),
  spinner: elementPropsToTemplate({
    ...base3DComponentDef,
    ...hasReactChildren(),
    speed: prop.float3.field(),
    range: prop.float3.field(),
  }),
  box: elementPropsToTemplate({
    ...base3DComponentDef,
    albedoColor: prop.color.field(),
    emissiveColor: prop.color.field(),
    size: prop.float3.field({ x: 1, y: 1, z: 1 }),
    colliderActive: prop.bool.field(),
    characterCollider: prop.bool.field(),
    ignoreRaycasts: prop.bool.field(),
  }),
  canvas: elementPropsToTemplate({
    ...base3DComponentDef,
    ...hasReactChildren(),
  }),
  rect: elementPropsToTemplate({
    ...base2DComponentDef,
    ...hasReactChildren(),
  }),
  image: elementPropsToTemplate({
    ...base2DComponentDef,
    ...hasReactChildren(),
    color: prop.color.field(),
  }),
  horizontalLayout: elementPropsToTemplate({
    ...base2DComponentDef,
    ...hasReactChildren(),
  }),
  verticalLayout: elementPropsToTemplate({
    ...base2DComponentDef,
    ...hasReactChildren(),
  }),
  text: elementPropsToTemplate({
    ...base2DComponentDef,
    children: prop.string.field(),
    color: prop.color.field(),
  }),
  button: elementPropsToTemplate({
    ...base2DComponentDef,
    ...hasReactChildren(),
  }),
  texture: elementPropsToTemplate({
    ...baseComponentDef,
    uri: prop.string.field(),
  }),
};

export type Props = ElementTemplateSetJsxSignatureLibrary<typeof componentDefs>;

export default elementTemplatesToJsxPrototypes(componentDefs);
