import React from "react";

interface NeosRef {}

interface NeosElement extends React.ClassAttributes<NeosRef> {
  active?: boolean;
  persistent?: boolean;
}

type ObjectVec4D = { x: number; y: number; z: number; w: number };
type ArrayVec4D = [number, number, number, number];
type SingleTVec4D = number;
export type Vec4D = ObjectVec4D | ArrayVec4D | SingleTVec4D;

type ObjectVec3D = { x: number; y: number; z: number };
type ArrayVec3D = [number, number, number];
type SingleTVec3D = number;
export type Vec3D = ObjectVec3D | ArrayVec3D | SingleTVec3D;

type ObjectVec2D = { x: number; y: number };
type ArrayVec2D = [number, number];
type SingleTVec2D = number;
export type Vec2D = ObjectVec2D | ArrayVec2D | SingleTVec2D;

type FixedColor = "red";
// A single number is interpreted as a vec4.
export type Color = Vec4D | Vec3D | FixedColor;

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

export interface NeosElements {
  nSlot: DetailedNeos3DElementProps & {
    children?: DetailedNeos3DElementProps[] | DetailedNeos3DElementProps;
  };
  nSmoothTransform: DetailedNeos3DElementProps & {
    children?: DetailedNeos3DElementProps[] | DetailedNeos3DElementProps;
  };
  nCanvas: DetailedNeos3DElementProps & {
    size?: Vec2D;
    children?: DetailedNeos2DElementProps[] | DetailedNeos2DElementProps;
  };

  nRectTransform: DetailedNeos2DElementProps & {
    children?: DetailedNeos2DElementProps[] | DetailedNeos2DElementProps;
  };
  nText: DetailedNeos2DElementProps & {
    children?: string;
    nullText?: string;
    parseRichText?: boolean;
    horizontalAlignment?: "left" | "center" | "right" | "justify";
    color?: Color;
    size?: number;
    horizontalAutoSize?: boolean;
    verticalAutoSize?: boolean;
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends NeosElements {}
  }
}
