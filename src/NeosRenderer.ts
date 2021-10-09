import React from "react";
import Reconciler from "react-reconciler";
import elementDefs from "./NeosElement";
import { OutboundSignal, InboundSignal } from "./SignalFormatter";
import { performance } from "perf_hooks";

export interface PropsDelta {
  propDiffs: Array<string>;
}

type ObjectRefs<K extends string, T> = {
  [Key in K]: {
    type: T;
    id: string;
  };
};

interface Container {
  rootId: string;
  globalId: number;
  eventQueue: Array<OutboundSignal>;
}

type Instance = {
  id: string;
  container: Container;
};

const reconciler = Reconciler<
  keyof typeof elementDefs,
  Record<string, any>,
  Container,
  Instance,
  never,
  never,
  never,
  ObjectRefs<string, string>,
  {},
  PropsDelta,
  never,
  NodeJS.Timer,
  number
>({
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  noTimeout: -1,
  isPrimaryRenderer: true,

  createInstance(type, props, container) {
    const id = `${container.globalId++}`;
    container.eventQueue.push({
      signal: "create",
      id,
      type,
    });
    const def = elementDefs[type];
    if (def === undefined) {
      throw new Error(`Unknown element type ${type}`);
    }
    const diffs: PropsDelta = {
      propDiffs: [],
    };
    def({}, props, diffs);
    if (diffs.propDiffs.length > 0) {
      container.eventQueue.push({
        signal: "update",
        id,
        props: diffs.propDiffs,
      });
    }
    return {
      id,
      container,
    };
  },
  createTextInstance() {
    throw new Error(
      "Manually setting text isn't supported, wrap it in a text element."
    );
  },

  clearContainer(container) {
    container.eventQueue.push({
      signal: "remove",
      id: container.rootId,
    });
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.container.eventQueue.push({
      signal: "setParent",
      id: child.id,
      parentId: parentInstance.id,
    });
  },

  appendChild(parentInstance, child) {
    parentInstance.container.eventQueue.push({
      signal: "setParent",
      id: child.id,
      parentId: parentInstance.id,
    });
  },
  appendChildToContainer(container, child) {
    container.eventQueue.push({
      signal: "setParent",
      id: child.id,
      parentId: container.rootId,
    });
  },

  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.container.eventQueue.push({
      signal: "setParent",
      id: child.id,
      parentId: parentInstance.id,
      after: beforeChild.id,
    });
  },
  insertInContainerBefore(container, child, beforeChild) {
    container.eventQueue.push({
      signal: "setParent",
      id: child.id,
      parentId: container.rootId,
      after: beforeChild.id,
    });
  },

  removeChild(parentInstance, child) {
    child.container.eventQueue.push({
      signal: "remove",
      id: child.id,
    });
  },
  removeChildFromContainer(container, child) {
    child.container.eventQueue.push({
      signal: "remove",
      id: child.id,
    });
  },

  finalizeInitialChildren() {
    return false;
  },

  prepareUpdate(instance, type, oldProps, newProps) {
    const def = elementDefs[type];
    if (def === undefined) {
      throw new Error(`Unknown element type ${type}`);
    }
    const diffs: PropsDelta = {
      propDiffs: [],
    };
    def(oldProps, newProps, diffs);
    return diffs.propDiffs.length > 0 ? diffs : null;
  },

  commitUpdate(instance, updatePayload) {
    instance.container.eventQueue.push({
      signal: "update",
      id: instance.id,
      props: updatePayload.propDiffs,
    });
  },

  shouldSetTextContent(type) {
    return type === "nText";
  },

  getRootHostContext() {
    return {};
  },
  getChildHostContext() {
    return {};
  },

  getPublicInstance(instance) {
    return {};
  },
  prepareForCommit() {
    return null;
  },
  resetAfterCommit() {},
  preparePortalMount() {},

  now: performance.now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
});

export default function createNeosRenderer() {
  const containerInfo: Container = {
    rootId: "root",
    globalId: 1,
    eventQueue: [],
  };
  const container = reconciler.createContainer(containerInfo, 0, false, null);

  return {
    processEvent(signal: InboundSignal) {
      //const targetElem = containerInfo.eventSubscription[signal.id];
      //if (targetElem) {
      //  const handler = targetElem[signal.event];
      //  if (signal) {
      //    handler(signal.arg);
      //  }
      //}
    },
    render(node: React.ReactNode): Array<OutboundSignal> {
      reconciler.updateContainer(node, container);
      const queue = containerInfo.eventQueue;
      containerInfo.eventQueue = [];
      return queue;
    },
  };
}
