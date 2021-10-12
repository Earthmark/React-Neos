import React from "react";
import { WebSocketServer } from "ws";
import Renderer from "./neosRenderer";
import { stringifySignalArray, parseSignal } from "./signalFormatter";

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

function ReactNeosServer(port: number, root: () => React.ReactElement) {
  HostReactProxyServer(port, () => {
    const renderer = Renderer();
    return (event) => {
      if (event !== null) {
        const signal = parseSignal(event);
        if (signal !== null) {
          renderer.processEvent(signal);
        }
      }
      return stringifySignalArray(renderer.render(root()));
    };
  });
}

export default ReactNeosServer;
