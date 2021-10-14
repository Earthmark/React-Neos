import React from "react";
import { WebSocketServer } from "ws";
import Reconciler, { ElementUpdater } from "./neosRenderer";
import { stringifySignalArray, parseSignal } from "./signalFormatter";
import { elementDefs } from "./neosElement";

export function HostReactProxyServer(
  port: number,
  eventSender: () => (event: string | null) => string
) {
  const server = new WebSocketServer({ port });
  server.on("connection", (ws) => {
    const instance = eventSender();
    ws.send(instance(null));
    ws.on("message", (message) => {
      ws.send(instance(message.toString("utf-8")));
    });
  });
}

function ReactNeosServer<ElementDefinitions>({
  port,
  root,
  elementDefinitions,
}: {
  port: number;
  root: () => React.ReactElement;
  elementDefinitions?: {
    [ElementType in keyof ElementDefinitions]: ElementUpdater<
      ElementDefinitions[ElementType]
    >;
  };
}) {
  const reconciler = Reconciler(elementDefinitions ?? (elementDefs as any));
  HostReactProxyServer(port, () => {
    const renderer = reconciler.createContainerInstance();
    return (event) => {
      if (event !== null) {
        const signal = parseSignal(event);
        if (signal !== null) {
          renderer.onEvent(signal);
        }
      }
      return stringifySignalArray(renderer.render(root()));
    };
  });
}

export default ReactNeosServer;
