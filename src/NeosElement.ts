import React, { ReactElement } from "react";
import { PropsDelta } from "./NeosRenderer";
import { differs, DiffFunc } from "./Primitives";

type MaybeArray<T> = T | Array<T>;

function HasReactChildren<T>(): {
  children: DiffFunc<MaybeArray<ReactElement<Partial<T>>>>;
} {
  return {
    children: () => null,
  };
}

const baseElementDef = {
  active: differs.bool,
  persistent: differs.bool,
  name: differs.string,
  tag: differs.string,
};

const base3DElementDef = {
  ...baseElementDef,
  position: differs.float3,
  rotation: differs.floatQ,
  scale: differs.float3,
};

const base2DElementDef = {
  ...baseElementDef,
  anchorMin: differs.float2,
  anchorMax: differs.float2,
  offsetMin: differs.float2,
  offsetMax: differs.float2,
  pivot: differs.float2,
};

function defsToDiffer<Props>(
  elementDef: PropsDef<Props>
): PropsDiffer<Partial<Props>> {
  return (a, b, d) => {
    for (const key in elementDef) {
      const differ = elementDef[key];
      const result = differ(a[key], b[key]);
      if (result !== null) {
        d.propDiffs.push({
          ...result,
          prop: key,
        });
      }
    }
  };
}

export function mapDefsToDiffers<PropMap>(o: {
  [Type in keyof PropMap]: PropsDef<PropMap[Type]>;
}): {
  [Type in keyof PropMap]: PropsDiffer<Partial<PropMap[Type]>>;
} {
  const result: any = {};
  for (const key in o) {
    result[key] = defsToDiffer(o[key]);
  }
  return result;
}

export const elementDefs = mapDefsToDiffers({
  transform: {
    ...base3DElementDef,
    ...HasReactChildren<PropsFromDef<typeof base3DElementDef>>(),
  },
  smoothTransform: {
    ...base3DElementDef,
    ...HasReactChildren<PropsFromDef<typeof base3DElementDef>>(),
    smoothTransformEnabled: differs.bool,
    smoothSpeed: differs.float,
  },
  spinner: {
    ...base3DElementDef,
    ...HasReactChildren<PropsFromDef<typeof base3DElementDef>>(),
    speed: differs.float3,
    range: differs.float3,
  },
  box: {
    ...base3DElementDef,
    albedoColor: differs.color,
    emissiveColor: differs.color,
    size: differs.float3,
    colliderActive: differs.bool,
    characterCollider: differs.bool,
    ignoreRaycasts: differs.bool,
  },
  canvas: {
    ...base3DElementDef,
  },
  rect: {
    ...base2DElementDef,
  },
  text: {
    ...base2DElementDef,
    children: differs.string,
  },
  button: {
    ...base2DElementDef,
  },
});

const elementProps: {
  [Type in keyof typeof elementDefs]: (
    p: PropsFromDiffer<typeof elementDefs[Type]>
  ) => React.ReactElement<PropsFromDiffer<typeof elementDefs[Type]>, Type>;
} = Object.fromEntries(
  Object.keys(elementDefs).map((e) => [e, e])
) as unknown as any;

type PropsDiffer<Props> = (a: Props, b: Props, d: PropsDelta) => void;

type PropsDef<Props> = {
  [Prop in keyof Props]: DiffFunc<Props[Prop]>;
};

type PropsFromDiffer<Def> = Def extends PropsDiffer<infer Props>
  ? Props
  : never;

type PropsFromDef<Def> = Def extends PropsDef<infer Props> ? Props : never;

export type ElementProps = {
  [P in keyof typeof elementDefs]: PropsFromDiffer<typeof elementDefs[P]>;
};

export default elementProps;
