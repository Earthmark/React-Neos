import prop from "./props.js";
import {
  hasReactChildren,
  elementPropsSetToTemplates,
  elementTemplatesToJsxPrototypes,
  ElementTemplateSetJsxSignatureLibrary,
} from "./componentsBase.js";

const baseComponentDef = {
  name: prop.string.refField(),
  tag: prop.string.refField(),
  slot: prop.slot.ref(),
}

const activateComponentDef = {
  ...baseComponentDef,
  active: prop.bool.refField(),
  persistent: prop.bool.refField(),
};

const transformComponentDef = {
  ...activateComponentDef,
  position: prop.float3.refField(),
  rotation: prop.floatQ.refField(),
  scale: prop.float3.refField({ x: 1, y: 1, z: 1 }),
};

const transforms = {
  transform: {
    ...transformComponentDef,
    ...hasReactChildren(),
  },
  smoothTransform: {
    ...transformComponentDef,
    ...hasReactChildren(),
    smoothTransformEnabled: prop.bool.refField(),
    smoothSpeed: prop.float.refField(),
  },
  spinner: {
    ...transformComponentDef,
    ...hasReactChildren(),
    speed: prop.float3.refField(),
    range: prop.float3.refField(),
  }
};

const baseColliderComponentDef = {
  ...transformComponentDef,
  offset: prop.float3.field(),
  type: prop.colliderType.field(),
  mass: prop.float.field(),
  characterCollider: prop.bool.field(),
  ignoreRaycasts: prop.bool.field(),
};

const colliders = {
  boxCollider: {
    ...baseColliderComponentDef,
    size: prop.float3.field({x: 1, y: 1, z: 1}),
  },
  capsuleCollider: {
    ...baseColliderComponentDef,
    height: prop.float.field(),
    radius: prop.float.field(),
  },
  coneCollider: {
    ...baseColliderComponentDef,
    height: prop.float.field(),
    radius: prop.float.field(),
  },
  sphereCollider: {
    ...baseColliderComponentDef,
    radius: prop.float.field(),
  },
  meshCollider: {
    ...baseColliderComponentDef,
    mesh: prop.mesh.field(),
    sidedness: prop.string.field(),
    actualSpeculativeMargin: prop.float.field(),
  },
  convexHullCollider: {
    ...baseColliderComponentDef,
    mesh: prop.mesh.field(),
  }
};

const renderers = {
  meshRenderer: {
    ...transformComponentDef,
    mesh: prop.mesh.field(),
    material: prop.material.field(),
  }
};

const meshComponentBase = {
  ...baseComponentDef,
  mesh: prop.mesh.ref(),
};

const meshes = {
  mesh: {
    ...meshComponentBase,
    url: prop.uri.refField(),
  },
  boxMesh: {
    ...meshComponentBase,
    name: prop.string.refField(),
    tag: prop.string.refField(),
    size: prop.float3.field({x: 1, y: 1, z: 1}),
    uvScale: prop.float3.field(),
    scaleUvWithSize: prop.bool.field(),
  },
  sphereMesh: {
    ...meshComponentBase,
    name: prop.string.refField(),
    tag: prop.string.refField(),
    radius: prop.float.field(),
  },
};

const materialComponentBase = {
  ...baseComponentDef,
  material: prop.material.ref(),
};

const materials = {
  unlitMaterial: {
    ...materialComponentBase,
    name: prop.string.refField(),
    tag: prop.string.refField(),
    color: prop.color.refField(),
  },
};

const textureComponentBase = {
  ...baseComponentDef,
  texture: prop.iTexture2D.ref(),
};

const textures = {
  texture2D: {
    ...textureComponentBase,
    url: prop.uri.field(),
    filterMode: prop.string.field(),
    anisotropicLevel: prop.int.field(),
    wrapModeU: prop.string.field(),
    wrapModeV: prop.string.field(),
  }
};

const base2DComponentDef = {
  ...activateComponentDef,
  anchorMin: prop.float2.refField(),
  anchorMax: prop.float2.refField(),
  offsetMin: prop.float2.refField(),
  offsetMax: prop.float2.refField(),
  pivot: prop.float2.refField(),
};

const rectElements = {
  canvas: {
    ...transformComponentDef,
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
  }
}

export const componentDefs = elementPropsSetToTemplates({
  ...transforms,
  ...colliders,
  ...renderers,
  ...meshes,
  ...materials,
  ...textures,
  ...rectElements,
});

export type Props = ElementTemplateSetJsxSignatureLibrary<typeof componentDefs>;

export default elementTemplatesToJsxPrototypes(componentDefs);
