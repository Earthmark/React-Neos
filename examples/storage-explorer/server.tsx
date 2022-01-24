import React from "react";
import { wsNeosProxyServer, createRender } from "react-neos";
import AssetGraph from "./AssetGraph.js";

export function runServer() {
    const render = createRender(<AssetGraph path="C:\\Users\\earth\\Downloads\\Records.json" />);
    wsNeosProxyServer(render, { port: 8080 });
    console.log("Server running on 8080")
}
