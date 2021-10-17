import React from "react";
import { ReactNeosServer } from "react-neos";
import Root from "./MoreComplicatedBox";

ReactNeosServer({ port: 8080, root: <Root /> });
