# React-Neos
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Earthmark/React-Neos/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/react-neos.svg?style=flat)](https://www.npmjs.com/package/react-neos) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

react-neos is a wrapper around the react-render-component library, where instead of a HTML dom it's a neos object!

## The general idea

There are two sections in the system, the `Client Side` and `Server Side`. They communicate using a websocket with a  horrible text format.

This roughly resembles [C#'s server size blazor](https://docs.microsoft.com/en-us/aspnet/core/blazor/hosting-models?view=aspnetcore-5.0), where the server tells the client what changes to make and the client sends back events, although events are not currently supported in react-neos.

You can also use `react-neos` to make and then `detach` from an object. This is especially useful for making UIs. This is referred to as `printer-mode`.

## Example: A small red box
Technical jargon is bland, here's some examples instead.

Here is a piece of `JSX` code that creates a small red box inside neos.
```jsx
import React from "react";
import n, { ReactNeosServer } from "react-neos";

const SmallBox = () => {
  return <n.box name="tiny square thing" size={[100, 20000, 0.01]} albedoColor={[1,0,0]} />;
};

ReactNeosServer({ port: 8080, root: SmallBox });
```
This `jsx element` as the element type of `box`, and sets the `props` of `name`, `size`, and `albedoColor`.

This generates the following hierarchy in Neos, which renders as a very small red box.
```
React-Neos-Root
  tiny square thing - contains a mesh renderer, material, and procedural mesh.
```
I'm cheating here, there is really more hidden above root and below the slot `tiny square thing`, but for now that doesn't matter.



## Example: A complicated red box
This isn't all that interesting, we made a tiny box. If you're doing something simple like a single box, `React-Neos` is likely more than you need.

`React` gets powerful when you need to compose things.
```jsx
import React from "react";
import SimpleWsServer from "./Server";

const BigBox = () => {
  return <nBox name="tiny square thing" size={[100, 20000, 0.01]} albedoColor={[1,0,0]} />;
};

SimpleWsServer(8080, BigBox);
```

## Creating a new template

```
React-Neos
  Templates
    nBox
      ****
        __this
        __proxy
        name
        size
        albedoColor
        ... others ...
  Staging
  Root
    tiny square thing
      1
        __this
        __proxy
        name
        size
        albedoColor
        ... others ...
  Logix
```
Pretty much all of this can be ignored, but it's good to see how these things map together.

`Root` is where React-Neos creates objects.

`Templates` contains `nBox`, the same name as in the `JSX element`. This is how `templates` are found. If you wish to install a new template, simply place it inside `Templates` and ensure it starts with a lowercase letter.

`Staging` is a special slot that is used during construction, for now it's not important.

Below each template is a slot dubbed an `element proxy` (it even must be tagged `react-neos-element-proxy`), in this case it looks like `****` in the template and `1` in the `live element`. All of the logic for how `React-Neos` is stored on this `element proxy`. When in `Printer-mode` the tool simply deletes all instances of these proxies out of `Root`, and the printed object is detached from React-Neos

The slots below the `element proxy` are `field proxies`. These `field proxies` don't need to be separate slots, but it makes development much easier. Each `field proxy` uses the slot name of the slot as the name of the prop the field is bound to. This can show you what fields are available

`__this` and `__proxy` (and another field, `__children`) are special, they're not exposed via props and are used internally by the `React-Neos` client.

`__this` points to the root of the `element`, in this case `nBox`. 

`__proxy` points to the `element proxy`.

`__children` points to where any children should be placed.

# Message Format

Due to Neos not having serialization support, the message format between the `client` and `server` is custom.
In the future JSON is likely to be used, but for now the format is designed for ease of parsing on the Neos side, not for readability or maintainability.

## Signals

A single websocket `message` may contain multiple `signals` in sequence, there are four kinds of `signals`.

*The word `Signal` was used to disambiguate it from websocket `messages`.*

`create` signals spawn an instance of the element type into a staging location and initialize the instance with the provided element ID. Before this point the element ID should be unused.
```
create+1+nBox
create+2+nTransform
```

`remove` deletes the element from the hierarchy. If `root` is deleted, the children of `root` are deleted instead.
```
remove+root
remove+2
```

`update` sends new values to populate the element with, a value of `$` means the field was `nulled` and should return to its default value. Only changed values are sent.
```
update+4+rotation=floatQ=[0;0;0]+scale=float3=$
update+3+speed=float3=[0;60;0]
```

`setParent` moves the `target element` to be a child of the `parent element`. If a `previous element` is specified (the provided ID is not `$`) the `target element` will be inserted just after the `previous element`. If not specified the `target element` is inserted at the end of the `parent element's` children.
```
setParent+4+5+$
setParent+5+root+2
```

## Delimiters

The format is a suffix tagged block of `signals`, each `signal` is terminated with a `marker symbol`.

String property updates are the only dynamic 
The values of string property updates are `urlencoded` (because it's what neos supports escaping wise), all marker symbols are character that are escaped in urlencoded format. This way encoded strings can't break parsing Neos side.

Each `signal` is separated using the `|` symbol.
```
create+1+nBox|create+2+nTransform|update+2+position=float3=[5;0;0]
```

Each `signal field` is separated with a `+` symbol
```
create+2+nTransform
```

Each `property update` of an `update signal` is separated with a `=` symbol.
```
update+4+rotation=floatQ=[0;0;0]+scale=float3=[1;1;1]
```

# Server Side

