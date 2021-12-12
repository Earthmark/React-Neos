import React from "react";
import Reconciler from "react-reconciler";
import { ElementId, InboundSignal, OutboundSignal, PropUpdate } from "./signal";
import { performance } from "perf_hooks";
import { componentDefs } from "./components";

export interface ElementTemplate<Props, Refs> {
  updater: ElementUpdater<Props>;
  refFactory: ElementRefFactory<Refs>;
}

export type ElementUpdater<Props = {}> = (
  oldProps: Partial<Props>,
  newProps: Partial<Props>,
  update: {
    diff: (prop: PropUpdate) => void;
    //register: (handler: ((arg: string) => void) | undefined) => () => void;
  }
) => void;

export type ElementRefFactory<Refs> = (id: ElementId) => FieldRefs<Refs>;

export type FieldRefs<FieldTypes> = {
  [Field in keyof FieldTypes]: FieldRef<Extract<FieldTypes[Field], string>>;
};

export interface FieldRef<TypeName extends string> {
  type: TypeName;
  name: string;
  elementId: string;
}

export interface ReactNeosRenderer {
  createInstance(): {
    render(signal?: Array<InboundSignal>): Array<OutboundSignal>;
  };
}

interface Container extends LogicalInstance {
  globalInstanceId: number;
  globalEventId: number;
  eventQueue: Array<OutboundSignal>;
}

interface RenderedInstance extends LogicalInstance {
  container: Container;
  updater: ElementUpdater<any>;
  refs: FieldRefs<any>;
}

interface LogicalInstance {
  id: string;
  children: Record<string, LogicalInstance>;
  events: Record<string, (arg: string) => void>;
}

function getElementById(
  id: string,
  instance: LogicalInstance
): LogicalInstance | undefined {
  if (instance.id === id) {
    return instance;
  }
  for (const child of Object.values(instance.children ?? {})) {
    const result = getElementById(id, child);
    if (result) {
      return result;
    }
  }
}

export default function createRender<
  AdditionalComponents extends Record<
    keyof AdditionalComponents,
    ElementTemplate<any, any>
  >
>(
  node: React.ReactNode,
  elementTemplates?: AdditionalComponents
): ReactNeosRenderer {
  return {
    createInstance() {
      const components = elementTemplates ?? componentDefs;
      const reconciler = Reconciler<
        Extract<keyof typeof components, string>,
        Record<string, any>,
        Container,
        RenderedInstance,
        never,
        never,
        never,
        FieldRefs<any>,
        {},
        {
          diffs: Array<PropUpdate>;
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

        prepareUpdate(instance, type, oldProps, newProps) {
          const diffs: Array<PropUpdate> = [];
          instance.updater(oldProps, newProps, {
            diff: (prop) => {
              diffs.push(prop);
            },
            // register: (handler) => {
            //   return () => {};
            // },
          });
          return diffs.length > 0 ? { diffs } : null;
        },

        createInstance(type, props, container, context) {
          const id = `${container.globalInstanceId++}`;
          container.eventQueue.push({
            signal: "create",
            id,
            type,
          });
          const template = components[type];
          if (template === undefined) {
            throw new Error(`Unknown element type ${type}`);
          }
          const instance = {
            id,
            container,
            updater: template.updater,
            refs: template.refFactory(id),
            children: {},
            events: {},
          };

          const diffs: Array<PropUpdate> = [];
          instance.updater({}, props, {
            diff: (prop) => {
              diffs.push(prop);
            },
            // register: (handler) => {
            //   return () => {};
            // },
          });
          const delta = diffs.length > 0 ? { diffs } : null;

          if (delta && delta.diffs.length > 0) {
            container.eventQueue.push({
              signal: "update",
              id,
              props: delta.diffs,
            });
          }
          return {
            id,
            container,
            updater: template.updater,
            refs: template.refFactory(id),
            children: {},
            events: {},
          };
        },
        createTextInstance() {
          throw new Error(
            "Manually setting text isn't supported, wrap it in a text element."
          );
        },

        clearContainer(container) {
          container.children = {};
          container.eventQueue.push({
            signal: "remove",
            id: container.id,
          });
        },

        appendInitialChild(parentInstance, child) {
          parentInstance.children[child.id] = child;
          parentInstance.container.eventQueue.push({
            signal: "setParent",
            id: child.id,
            parentId: parentInstance.id,
          });
        },

        appendChild(parentInstance, child) {
          parentInstance.children[child.id] = child;
          parentInstance.container.eventQueue.push({
            signal: "setParent",
            id: child.id,
            parentId: parentInstance.id,
          });
        },
        appendChildToContainer(container, child) {
          container.children[child.id] = child;
          container.eventQueue.push({
            signal: "setParent",
            id: child.id,
            parentId: container.id,
          });
        },

        insertBefore(parentInstance, child, beforeChild) {
          parentInstance.children[child.id] = child;
          parentInstance.container.eventQueue.push({
            signal: "setParent",
            id: child.id,
            parentId: parentInstance.id,
            after: beforeChild.id,
          });
        },
        insertInContainerBefore(container, child, beforeChild) {
          container.children[child.id] = child;
          container.eventQueue.push({
            signal: "setParent",
            id: child.id,
            parentId: container.id,
            after: beforeChild.id,
          });
        },

        removeChild(parentInstance, child) {
          delete parentInstance.children[child.id];
          child.container.eventQueue.push({
            signal: "remove",
            id: child.id,
          });
        },
        removeChildFromContainer(container, child) {
          delete container.children[child.id];
          child.container.eventQueue.push({
            signal: "remove",
            id: child.id,
          });
        },

        finalizeInitialChildren() {
          return false;
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
      const containerInfo: Container = {
        id: "root",
        globalInstanceId: 1,
        globalEventId: 1,
        eventQueue: [],
        children: {},
        events: {},
      };
      const container = reconciler.createContainer(
        containerInfo,
        0,
        false,
        null
      );

      return {
        render(signals?: Array<InboundSignal>): Array<OutboundSignal> {
          for (const signal of signals ?? []) {
            const instance = getElementById(signal.id, container);
            if (instance) {
              const event = instance.events[signal.signal];
              if (event) {
                event(signal.arg);
              }
            }
          }

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
