import { WebSocketServer } from "ws";

function HostReactProxyServer(
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

export default HostReactProxyServer;
