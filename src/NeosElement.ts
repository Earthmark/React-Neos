import React from "react";
import { differs, parsers, Vec3D, Vec2D, Color } from "./Primitives";

type NeosRef = string;

interface NeosElement extends React.ClassAttributes<NeosRef> {
  active?: boolean;
  persistent?: boolean;
}

interface Has3DChildren {
  children?: DetailedNeos3DElementProps[] | DetailedNeos3DElementProps;
}
interface Has2DChildren {
  children?: DetailedNeos2DElementProps[] | DetailedNeos2DElementProps;
}

type DetailedNeos3DElementProps = NeosElement & {
  position?: Vec3D;
  rotation?: Vec3D;
  scale?: Vec3D;
};

type DetailedNeos2DElementProps = NeosElement & {
  anchorMin?: Vec2D;
  anchorMax?: Vec2D;
  offsetMin?: Vec2D;
  offsetMax?: Vec2D;
  pivot?: Vec2D;
};

type ButtonNeos2DElementProps = DetailedNeos2DElementProps & {
  onPress?: (e: string | null) => void;
  color?: Color;
  hoverColor?: Color;
  pressColor?: Color;
  disableColor?: Color;
};

type SmoothTransformProps = DetailedNeos3DElementProps &
  Has3DChildren & {
    smoothTransformEnabled?: boolean;
    smoothSpeed?: number;
  };

type SpinnerProps = DetailedNeos3DElementProps &
  Has3DChildren & {
    speed?: Vec3D;
    range?: Vec3D;
  };

type BoxProps = DetailedNeos3DElementProps & {
  albedoColor?: Color;
  emissiveColor?: Color;
  size?: Vec3D;
  colliderActive?: boolean;
  characterCollider?: boolean;
  ignoreRaycasts?: boolean;
};

type TextElementProps = DetailedNeos2DElementProps & {
  children?: Array<string> | string;
  nullContent?: string;
  color?: Color;
  size?: number;
  horizontalAutoSize?: boolean;
  verticalAutoSize?: boolean;
};

type Optional<T> = {
  [P in keyof T]: T[P] | null | undefined;
};

interface FieldGatherer<Props> {
  readonly oldProps: Optional<Props>;
  readonly newProps: Optional<Props>;
  arr: Array<string>;
  events: Record<string, (arg: string) => void>;
}

type DiffFunc<T> = (
  o: T | null | undefined,
  n: T | null | undefined
) => string | null;

function DiffField<
  Gatherer extends FieldGatherer<{
    [key in Accessor]?: FieldType | null | undefined;
  }>,
  Accessor extends string,
  FieldType
>(g: Gatherer, accessor: Accessor, differ: DiffFunc<FieldType>) {
  const delta = differ(g.oldProps[accessor], g.newProps[accessor]);
  if (delta !== null) {
    g.arr.push(accessor + "=" + delta);
  }
}

function HandleRegistration<
  Gatherer extends FieldGatherer<{
    [key in Accessor]?: ((val: FieldType | null) => void) | null | undefined;
  }>,
  Accessor extends string,
  FieldType
>(g: Gatherer, accessor: Accessor, parser: (val: string) => FieldType | null) {
  const o = g.oldProps[accessor];
  const n = g.newProps[accessor];
  const hasO = o !== undefined && o !== null;
  const hasN = n !== undefined && n !== null;
  if ((hasO || hasN) && o !== n) {
    if (hasN) {
      g.events[accessor] = (str) => {
        n(parser(str));
      };
    } else if (hasN) {
      delete g.events[accessor];
    }
  }
}
type FieldStringify<T> = (g: FieldGatherer<T>) => void;

const NeosElementStringify: FieldStringify<NeosElement> = (g) => {
  DiffField(g, "active", differs.bool);
  DiffField(g, "persistent", differs.bool);
};

const DetailedNeos3DElementPropsStringify: FieldStringify<DetailedNeos3DElementProps> =
  (g) => {
    NeosElementStringify(g);
    DiffField(g, "position", differs.float3);
    DiffField(g, "rotation", differs.floatQ);
    DiffField(g, "scale", differs.float3);
  };

const DetailedSmoothTransformPropsStringify: FieldStringify<SmoothTransformProps> =
  (g) => {
    DetailedNeos3DElementPropsStringify(g);
    DiffField(g, "smoothTransformEnabled", differs.bool);
    DiffField(g, "smoothSpeed", differs.float);
  };

const DetailedNeos2DElementPropsStringify: FieldStringify<DetailedNeos2DElementProps> =
  (g) => {
    NeosElementStringify(g);
    DiffField(g, "anchorMin", differs.float2);
    DiffField(g, "anchorMax", differs.float2);
    DiffField(g, "offsetMin", differs.float2);
    DiffField(g, "offsetMax", differs.float2);
    DiffField(g, "pivot", differs.float2);
  };

const TextPropsStringify: FieldStringify<TextElementProps> = (g) => {
  DetailedNeos2DElementPropsStringify(g);
  DiffField(g, "children", differs.string);
};

const BoxPropsStringify: FieldStringify<BoxProps> = (g) => {
  DetailedNeos3DElementPropsStringify(g);
  DiffField(g, "albedoColor", differs.color);
  DiffField(g, "emissiveColor", differs.color);
  DiffField(g, "size", differs.float3);
  DiffField(g, "colliderActive", differs.bool);
  DiffField(g, "characterCollider", differs.bool);
  DiffField(g, "ignoreRaycasts", differs.bool);
};

const SpinnerPropsStringify: FieldStringify<SpinnerProps> = (g) => {
  DetailedNeos3DElementPropsStringify(g);
  DiffField(g, "speed", differs.float3);
  DiffField(g, "range", differs.float3);
};

const ButtonNeos2DElementPropsStringify: FieldStringify<ButtonNeos2DElementProps> =
  (g) => {
    DetailedNeos2DElementPropsStringify(g);
    HandleRegistration(g, "onPress", parsers.string);
  };

function With3DChildren<T>(
  f: FieldStringify<T>
): FieldStringify<T & Has3DChildren> {
  return f;
}

function With2DChildren<T>(
  f: FieldStringify<T>
): FieldStringify<T & Has2DChildren> {
  return f;
}

export const ElementPropStringifyMap = {
  nTransform: With3DChildren(DetailedNeos3DElementPropsStringify),
  nSmoothTransform: With3DChildren(DetailedSmoothTransformPropsStringify),
  nSpinner: With3DChildren(SpinnerPropsStringify),
  nBox: BoxPropsStringify,
  nCanvas: With2DChildren(DetailedNeos3DElementPropsStringify),
  nRectTransform: With2DChildren(DetailedNeos2DElementPropsStringify),
  nText: TextPropsStringify,
  nButton: With2DChildren(ButtonNeos2DElementPropsStringify),
};

type FieldStringifyProps<S> = S extends FieldStringify<infer Props>
  ? Props
  : never;

type FieldStringifyMap = {
  [T in keyof typeof ElementPropStringifyMap]: FieldStringifyProps<
    typeof ElementPropStringifyMap[T]
  >;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends FieldStringifyMap {}
  }
}
