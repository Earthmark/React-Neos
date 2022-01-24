import { WebSocketServer, WebSocket, ServerOptions } from "ws";
import { ReactNeosRenderer } from "./renderer.js";
import { stringifySignalArray, parseSignal } from "./signalFormatter.js";

function keepAlive(ws: WebSocket, keepalive?: number) {
  var isAlive = true;
  ws.on("pong", () => {
    isAlive = true;
  });
  const interval = setInterval(() => {
    if (!isAlive) {
      clearInterval(interval);
      ws.terminate();
      return;
    }
    isAlive = false;
    ws.ping();
  }, keepalive ?? 30000);
}

export default function wsNeosProxyServerRenderer(
  renderHandler: ReactNeosRenderer,
  options?: ServerOptions & { keepalive?: number }
) {
  const server = new WebSocketServer(options);
  server.on("connection", (ws) => {
    keepAlive(ws, options?.keepalive);
    const { render } = renderHandler.createInstance();

    const processMessage = (msg?: string) =>
      ws.send(stringifySignalArray(render(parseSignal(msg))));

    processMessage();
    ws.on("message", (message) => {
      processMessage(message.toString("utf-8"));
    });
  });
}
