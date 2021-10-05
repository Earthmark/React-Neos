import React from "react";
import { DeltaSolver, Vec3D, Vec2D, Color } from "./Primitives";

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

type Nullable<T> = {
  [P in keyof T]: T[P] | null | undefined;
};

type DifferInput<T> = T extends (
  oldProps: infer Arg,
  newProps: infer Arg
) => unknown
  ? Arg
  : never;

interface FieldGatherer<Props> {
  readonly oldProps: Nullable<Props>;
  readonly newProps: Nullable<Props>;
  arr: Array<string>;
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
  SolverKey extends keyof typeof DeltaSolver,
  FieldType extends DifferInput<typeof DeltaSolver[SolverKey]>
>(g: Gatherer, accessor: Accessor, type: SolverKey) {
  const solver: DiffFunc<FieldType> = DeltaSolver[type] as DiffFunc<FieldType>;
  const delta = solver(g.oldProps[accessor], g.newProps[accessor]);
  if (delta !== null) {
    g.arr.push(accessor + "=" + delta);
  }
}

type FieldStringify<T> = (g: FieldGatherer<T>) => void;

const NeosElementStringify: FieldStringify<NeosElement> = (g) => {
  DiffField(g, "active", "b");
  DiffField(g, "persistent", "b");
};

const DetailedNeos3DElementPropsStringify: FieldStringify<DetailedNeos3DElementProps> =
  (g) => {
    NeosElementStringify(g);
    DiffField(g, "position", "f3");
    DiffField(g, "rotation", "fq");
    DiffField(g, "scale", "f3");
  };

const DetailedNeos2DElementPropsStringify: FieldStringify<DetailedNeos2DElementProps> =
  (g) => {
    NeosElementStringify(g);
    DiffField(g, "anchorMin", "f2");
    DiffField(g, "anchorMax", "f2");
    DiffField(g, "offsetMin", "f2");
    DiffField(g, "offsetMax", "f2");
    DiffField(g, "pivot", "f2");
  };

const TextPropsStringify: FieldStringify<
  DetailedNeos2DElementProps & {
    children?: Array<string>;
    nullContent?: string;
    color?: Color;
    size?: number;
    horizontalAutoSize?: boolean;
    verticalAutoSize?: boolean;
  }
> = (g) => {
  DetailedNeos2DElementPropsStringify(g);
  DiffField(g, "children", "s");
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
  nSlot: With3DChildren(DetailedNeos3DElementPropsStringify),
  nSmoothTransform: With3DChildren(DetailedNeos3DElementPropsStringify),
  nCanvas: With2DChildren(DetailedNeos3DElementPropsStringify),
  nRectTransform: With2DChildren(DetailedNeos2DElementPropsStringify),
  nText: TextPropsStringify,
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
