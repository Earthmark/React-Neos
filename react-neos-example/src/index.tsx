import React from "react";
import { renderForEach, wsNeosProxyServer } from "react-neos";
import Root from "./MoreComplicatedBox";

const server = wsNeosProxyServer({ port: 8080 });
renderForEach(<Root />, server);
