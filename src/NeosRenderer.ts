import React from "react";
import Reconciler from "react-reconciler";
import { NeosElements } from "./NeosElement";

type ElementType3D = "transform" | "smoothTransform";
type ElementType2D = "barrier";

type Element3D = {
  children: Array<Element3D>;
};

type Element2D = {
  children: Array<Element2D>;
};

type Type = keyof NeosElements;
type Props = {
  children: any;
};
type Container = {
  children: Array<Instance | TextInstance>;
  tag: "CONTAINER";
};
type Instance = Element3D | Element2D;
type TextInstance = Element3D | Element2D;
type SuspenseInstance = {};
type HydratableInstance = {};
type PublicInstance = Element3D | Element2D;
type UpdatePayload = {};
type ChildSet = {};
type NoTimeout = {};

interface Element3DHostContext {
  type: "element3d";
}

interface Element2DHostContext {
  type: "element2d";
}

type HostContext = Element3DHostContext | Element2DHostContext;

const reconciler = Reconciler<
  Type,
  Props,
  Container,
  Instance,
  void,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  NodeJS.Timer,
  NoTimeout
>({
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  noTimeout: -1,
  isPrimaryRenderer: true,

  createInstance(type, props) {
    console.log("createInstance", type, props);
    const base = {
      children: [],
    };
    switch (type) {
      case "nSlot":
        return base;
      case "nSmoothTransform":
        return base;
      default:
        return base;
    }
  },
  clearContainer(container) {
    console.log("clearContainer");
    container.children = [];
  },
  createTextInstance(text, rootContainerInstance) {
    console.log("createTextInstance");
    throw new Error(
      "Manually setting text isn't supported, wrap it in a text element."
    );
  },
  appendInitialChild(parentInstance, child) {
    console.log("appendInitialChild");
    if (child !== undefined) {
      parentInstance.children.push(child);
    }
  },
  appendChildToContainer(container, child) {
    console.log("appendChildToContainer");
    if (child) {
      container.children.push(child);
    }
  },
  finalizeInitialChildren(element, type, props) {
    console.log("finalizeInitialChildren");
    return false;
  },
  prepareUpdate(element, type, oldProps, newProps) {
    console.log("prepareUpdate");
    return null;
  },
  shouldSetTextContent(type, props) {
    console.log("shouldSetTextContent");
    return type === "nText" && typeof props.children === "string";
  },

  getRootHostContext(container) {
    console.log("getRootHostContext");
    return {
      type: "element3d",
    };
  },
  getChildHostContext(parentHostContext, type, rootContainerInstance) {
    console.log("getChildHostContext");
    if (type === "nCanvas") {
      return {
        type: "element2d",
      };
    } else {
      return parentHostContext;
    }
  },

  getPublicInstance(instance) {
    console.log("getPublicInstance");
    return instance!;
  },
  prepareForCommit(containerInfo) {
    console.log("prepareForCommit");
    return null;
  },
  resetAfterCommit(containerInfo) {
    console.log("resetAfterCommit");
  },
  preparePortalMount(containerInfo) {
    console.log("preparePortalMount");
  },
  now() {
    console.log("now");
    return 0;
  },
  scheduleTimeout(fn, delay) {
    console.log("scheduleTimeout");
    return setTimeout(fn, delay);
  },
  cancelTimeout(id) {
    console.log("cancelTimeout");
    clearTimeout(id);
  },
});

const createNeosRenderer = () => ({
  render(node: React.ReactNode) {
    const container = reconciler.createContainer(
      {
        children: [],
        tag: "CONTAINER",
      },
      0,
      false,
      null
    );
    reconciler.updateContainer(node, container);
  },
});

export default createNeosRenderer;
