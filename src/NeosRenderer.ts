import React from "react";
import Reconciler from "react-reconciler";
import { ElementPropStringifyMap } from "./NeosElement";
import { OutboundSignal, InboundSignal } from "./SignalFormatter";
import { performance } from "perf_hooks";

interface Container {
  rootId: string;
  eventQueue: Array<OutboundSignal>;
  eventSubscription: Record<string, (arg: string) => void>;
}

type Instance = {
  id: string;
  container: Container;
};

var globalId: number = 1;

const reconciler = Reconciler<
  keyof typeof ElementPropStringifyMap,
  {},
  Container,
  Instance,
  never,
  never,
  never,
  void,
  {},
  Array<string>,
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
    const arr: Array<string> = [];
    ElementPropStringifyMap[type]({
      oldProps: {},
      newProps: props,
      arr,
    });
    const id = `${globalId++}`;
    container.eventQueue.push({
      signal: "create",
      id,
      type,
    });
    if (arr.length > 0) {
      container.eventQueue.push({
        signal: "update",
        id,
        props: arr,
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
    const arr: Array<string> = [];
    ElementPropStringifyMap[type]({
      oldProps: oldProps,
      newProps: newProps,
      arr,
    });
    return arr.length > 0 ? arr : null;
  },

  commitUpdate(instance, updatePayload) {
    instance.container.eventQueue.push({
      signal: "update",
      id: instance.id,
      props: updatePayload,
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

  getPublicInstance() {},
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
  const containerInfo = {
    rootId: "root",
    eventQueue: [],
    eventSubscription: {},
  };
  const container = reconciler.createContainer(containerInfo, 0, false, null);

  return {
    processEvent(event: InboundSignal) {},
    render(node: React.ReactNode): Array<OutboundSignal> {
      reconciler.updateContainer(node, container);
      const queue = containerInfo.eventQueue;
      containerInfo.eventQueue = [];
      return queue;
    },
  };
}
