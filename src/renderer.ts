import React from "react";
import Reconciler from "react-reconciler";
import { ElementId, InboundSignal, OutboundSignal, PropUpdate } from "./signal";
import { performance } from "perf_hooks";

export interface ReactNeosRenderer {
  createInstance(): {
    render(signal?: Array<InboundSignal>): Array<OutboundSignal>;
  };
}

export type ElementUpdater<Props = {}> = (
  oldProps: Partial<Props>,
  newProps: Partial<Props>,
  update: {
    diff(prop: PropUpdate): void;
  }
) => void;

export type FieldRef<TypeName extends string> = {
  type: TypeName;
  name: string;
  elementId: string;
};

export type FieldRefs<FieldTypes> = {
  [Field in keyof FieldTypes]: FieldRef<Extract<FieldTypes[Field], string>>;
};

export type ElementRefFactory<Refs> = (id: ElementId) => FieldRefs<Refs>;

export interface ElementTemplate<Props, Refs> {
  updater: ElementUpdater<Props>;
  refFactory: ElementRefFactory<Refs>;
}

interface Container {
  rootId: string;
  globalId: number;
  eventQueue: Array<OutboundSignal>;
}

type Instance = {
  id: string;
  container: Container;
  updater: ElementUpdater<any>;
  refs: FieldRefs<any>;
};

export default function createRender<
  ElementTemplates extends {
    [ElementName in ElementNames]: ElementTemplate<any, any>;
  },
  ElementNames extends keyof ElementTemplates & string
>(
  node: React.ReactNode,
  elementTemplates: ElementTemplates
): ReactNeosRenderer {
  const reconciler = Reconciler<
    ElementNames,
    Record<string, any>,
    Container,
    Instance,
    never,
    never,
    never,
    FieldRefs<any>,
    {},
    {
      diffs: Array<PropUpdate<any>>;
    },
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
      const template = elementTemplates[type];
      if (template === undefined) {
        throw new Error(`Unknown element type ${type}`);
      }
      const diffs: Array<PropUpdate<any>> = [];
      template.updater({}, props, {
        diff: (prop) => {
          diffs.push(prop);
        },
      });
      if (diffs.length > 0) {
        container.eventQueue.push({
          signal: "update",
          id,
          props: diffs,
        });
      }
      return {
        id,
        container,
        updater: template.updater,
        refs: template.refFactory(id),
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
      const diffs: Array<PropUpdate<any>> = [];
      instance.updater(oldProps, newProps, {
        diff: (prop) => {
          diffs.push(prop);
        },
      });
      return diffs.length > 0 ? { diffs } : null;
    },

    commitUpdate(instance, updatePayload) {
      instance.container.eventQueue.push({
        signal: "update",
        id: instance.id,
        props: updatePayload.diffs,
      });
    },

    shouldSetTextContent(type) {
      return type === "text";
    },

    getRootHostContext() {
      return {};
    },
    getChildHostContext() {
      return {};
    },

    getPublicInstance(instance) {
      console.log(instance);
      return instance.refs;
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

  return {
    createInstance() {
      const containerInfo: Container = {
        rootId: "root",
        globalId: 1,
        eventQueue: [],
      };
      const container = reconciler.createContainer(
        containerInfo,
        0,
        false,
        null
      );

      return {
        render(signal?: Array<InboundSignal>): Array<OutboundSignal> {
          var oldQueueCount, newQueueCount;
          do {
            oldQueueCount = containerInfo.eventQueue.length;
            reconciler.updateContainer(node, container);
            newQueueCount = containerInfo.eventQueue.length;
          } while (oldQueueCount !== newQueueCount);
          const queue = containerInfo.eventQueue;
          containerInfo.eventQueue = [];
          return queue;
        },
      };
    },
  };
}
