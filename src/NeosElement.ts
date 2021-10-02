import React from "react";
import { Vec4D, Vec3D, Vec2D, Color } from "./BaseTypes";

interface NeosRef {}

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

export interface NeosElements {
  nSlot: DetailedNeos3DElementProps & Has3DChildren;
  nSmoothTransform: DetailedNeos3DElementProps & Has3DChildren;
  nCanvas: DetailedNeos3DElementProps &
    Has2DChildren & {
      size?: Vec2D;
    };

  nRectTransform: DetailedNeos2DElementProps & Has2DChildren;
  nText: DetailedNeos2DElementProps & {
    children?: Array<string>;
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
