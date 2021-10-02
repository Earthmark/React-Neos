import React from "react";
import Reconciler from "react-reconciler";
import { NeosElements } from "./NeosElement";

interface BaseElement {
  id: string;
  parent?: BaseElement;
}

interface ChildElement<ChildType> extends BaseElement {
  children: Array<ChildType>;
}

interface Element3D extends ChildElement<Element3D> {}

interface Element2D extends ChildElement<Element2D> {}

type Type = keyof NeosElements;

interface Container {
  children: Array<BaseElement>;
}

type Instance = Element3D | Element2D;

interface PropDelta {}

interface Props {}

type ElementId = string;

interface CreateSignal {
  signal: "Create";
  id: ElementId;
  type: string;
  parent: ElementId;
  props: Record<string, string>;
}

interface MountSignal {
  signal: "Mount";
  id: ElementId;
}

interface RemoveSignal {
  signal: "Remove";
  id: ElementId;
}

interface UpdateSignal {
  signal: "Update";
  id: ElementId;
  propsDelta: Record<string, string>;
}

interface SetParentSignal {
  signal: "SetParent";
  childId: ElementId;
  parentId: ElementId;
}

type OutboundSignal =
  | CreateSignal
  | MountSignal
  | RemoveSignal
  | UpdateSignal
  | SetParentSignal;

interface EventSignal {
  signal: "Event";
  id: ElementId;
  event: string;
  payload: string;
}

type PropertyAssignments<Prop> = [
  keyof Prop,
  string,
  ...PropertyAssignments<Prop>[]
];

type ElementPropStringify<Properties> = (
  props: Properties
) => PropertyAssignments<Properties> | [];

const propsStringify: {
  [key in keyof NeosElements]: ElementPropStringify<NeosElements[key]>;
} = {
  nSlot(props) {
    return [];
  },
  nSmoothTransform(props) {
    return [];
  },
  nCanvas(props) {
    return [];
  },
  nRectTransform(props) {
    return [];
  },
  nText(props) {
    return [];
  },
};

interface BaseHostContext {
  id: string;
}

interface Element3DHostContext extends BaseHostContext {
  type: "element3d";
}

interface Element2DHostContext extends BaseHostContext {
  type: "element2d";
}

type HostContext = Element3DHostContext | Element2DHostContext;

const reconciler = Reconciler<
  Type,
  Props,
  Container,
  Instance,
  void,
  void,
  void,
  void,
  HostContext,
  PropDelta,
  void,
  NodeJS.Timer,
  number
>({
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  noTimeout: -1,
  isPrimaryRenderer: true,

  createInstance(type, props) {
    console.log("createInstance", type, props);
    const base = {
      id: "_",
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
  finalizeInitialChildren(instance, type, props) {
    console.log("finalizeInitialChildren");
    return false;
  },
  prepareUpdate(instance, type, oldProps, newProps) {
    console.log("prepareUpdate");
    return null;
  },
  shouldSetTextContent(type, props) {
    console.log("shouldSetTextContent");
    return type === "nText";
  },

  getRootHostContext(container) {
    console.log("getRootHostContext");
    return {
      type: "element3d",
      id: "_",
    };
  },
  getChildHostContext(parentHostContext, type, rootContainerInstance) {
    console.log("getChildHostContext");
    if (type === "nCanvas") {
      return {
        type: "element2d",
        id: parentHostContext.id + ".",
      };
    } else {
      return {
        type: "element3d",
        id: parentHostContext.id + ".",
      };
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

const createNeosRenderer = () => {
  const container = reconciler.createContainer(
    {
      children: [],
    },
    0,
    false,
    null
  );

  return {
    render(node: React.ReactNode) {
      reconciler.updateContainer(node, container);
    },
  };
};

export default createNeosRenderer;
