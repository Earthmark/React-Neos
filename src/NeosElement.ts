import { ReactNode } from "react";
import { PropsDelta } from "./NeosRenderer";
import { differs, DiffFunc } from "./Primitives";

const hasReactChildren: {
  children: DiffFunc<ReactNode>;
} = {
  children: () => null,
};

const baseElementDef = {
  active: differs.bool,
  persistent: differs.bool,
};

const base3DElementDef = {
  ...baseElementDef,
  position: differs.float3,
  rotation: differs.floatQ,
  scale: differs.float3,
};

const transformDef = {
  ...base3DElementDef,
  ...hasReactChildren,
};

const smoothTransformDef = {
  ...base3DElementDef,
  smoothTransformEnabled: differs.bool,
  smoothSpeed: differs.float,
};

const base2DElementDef = {
  ...baseElementDef,
  anchorMin: differs.float2,
  anchorMax: differs.float2,
  offsetMin: differs.float2,
  offsetMax: differs.float2,
  pivot: differs.float2,
};

const textElementDef = {
  ...base2DElementDef,
  children: differs.string,
};

const boxElementDef = {
  ...base3DElementDef,
  albedoColor: differs.color,
  emissiveColor: differs.color,
  size: differs.float3,
  colliderActive: differs.bool,
  characterCollider: differs.bool,
  ignoreRaycasts: differs.bool,
};

const spinnerElementDef = {
  ...base3DElementDef,
  ...hasReactChildren,
  speed: differs.float3,
  range: differs.float3,
};

const elementDefs = {
  nTransform: defsToDiffer(transformDef),
  nSmoothTransform: defsToDiffer(smoothTransformDef),
  nSpinner: defsToDiffer(spinnerElementDef),
  nBox: defsToDiffer(boxElementDef),
  nCanvas: defsToDiffer(base3DElementDef),
  nRectTransform: defsToDiffer(base2DElementDef),
  nText: defsToDiffer(textElementDef),
  nButton: defsToDiffer(base2DElementDef),
};

function defsToDiffer<Props>(
  elementDef: PropsDefDiffer<Props>
): PropsDiffer<Partial<Props>> {
  return (a, b, d) => {
    for (const key in elementDef) {
      const differ = elementDef[key];
      const result = differ(a[key], b[key]);
      if (result !== null) {
        d.propDiffs.push(key + "=" + result);
      }
    }
  };
}

type PropsDiffer<Props> = (a: Props, b: Props, d: PropsDelta) => void;

type PropsDefDiffer<Props> = {
  [Prop in keyof Props]: DiffFunc<Props[Prop]>;
};

type PropsFromDef<Def> = Def extends PropsDiffer<infer Props> ? Props : never;

export type ElementProps = {
  [P in keyof typeof elementDefs]: PropsFromDef<typeof elementDefs[P]>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends ElementProps {}
  }
}

export default elementDefs;
