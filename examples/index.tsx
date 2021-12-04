import React from "react";
import { createRender, wsNeosProxyServer } from "react-neos";
import Root from "./MoreComplicatedBox";

const render = createRender(<Root />);
wsNeosProxyServer(render, { port: 8080 });
console.log("Server started on port 8080");
