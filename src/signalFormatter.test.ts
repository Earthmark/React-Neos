import { stringifySignalArray, parseSignal } from "./signalFormatter.js";

test("stringify returns encoded create", () => {
  expect(
    stringifySignalArray([
      {
        signal: "create",
        id: "1",
        type: "transform",
      },
    ])
  ).toMatchInlineSnapshot(`"create+1+transform|"`);
});

test("stringify returns encoded remove", () => {
  expect(
    stringifySignalArray([
      {
        signal: "remove",
        id: "1",
      },
    ])
  ).toMatchInlineSnapshot(`"remove+1|"`);
});

test("stringify returns encoded empty update", () => {
  expect(
    stringifySignalArray([
      {
        signal: "update",
        id: "1",
        props: [],
      },
    ])
  ).toMatchInlineSnapshot(`"update+1+|"`);
});

test("stringify returns encoded single update", () => {
  expect(
    stringifySignalArray([
      {
        signal: "update",
        id: "1",
        props: [
          {
            prop: "a",
            type: "float3",
            value: null,
          },
        ],
      },
    ])
  ).toMatchInlineSnapshot(`"update+1+a=float3=$+|"`);
});

test("stringify returns encoded update", () => {
  expect(
    stringifySignalArray([
      {
        signal: "update",
        id: "1",
        props: [
          {
            prop: "a",
            type: "float3",
            value: null,
          },

          {
            prop: "a",
            type: "string",
            value: "abcdefg",
          },
        ],
      },
    ])
  ).toMatchInlineSnapshot(`"update+1+a=float3=$+a=string=abcdefg+|"`);
});

test("stringify returns encoded update", () => {
  expect(
    stringifySignalArray([
      {
        signal: "setParent",
        id: "1",
        parentId: "2",
      },
    ])
  ).toMatchInlineSnapshot(`"setParent+1+2+$|"`);
});

test("stringify returns encoded update with child id", () => {
  expect(
    stringifySignalArray([
      {
        signal: "setParent",
        id: "1",
        parentId: "2",
        after: "3",
      },
    ])
  ).toMatchInlineSnapshot(`"setParent+1+2+3|"`);
});

test("stringify returns expected encoded strings", () => {
  expect(
    stringifySignalArray([
      {
        signal: "create",
        id: "1",
        type: "transform",
      },

      {
        signal: "remove",
        id: "1",
      },

      {
        signal: "update",
        id: "1",
        props: [
          {
            prop: "a",
            type: "float3",
            value: null,
          },

          {
            prop: "a",
            type: "string",
            value: "abcdefg",
          },
        ],
      },

      {
        signal: "create",
        id: "3",
        type: "transform",
      },

      {
        signal: "setParent",
        id: "1",
        parentId: "2",
      },

      {
        signal: "setParent",
        id: "1",
        parentId: "2",
        after: "3",
      },

      {
        signal: "remove",
        id: "1",
      },
    ])
  ).toMatchInlineSnapshot(
    `"create+1+transform|remove+1|update+1+a=float3=$+a=string=abcdefg+|create+3+transform|setParent+1+2+$|setParent+1+2+3|remove+1|"`
  );
});

test("parse creates expected message", () => {
  expect(parseSignal("event+2+click+msg")).toStrictEqual([
    {
      arg: "msg",
      event: "click",
      id: "2",
      signal: "event",
    },
  ]);
});

test("parse undefined returns undefined", () => {
  expect(parseSignal()).toStrictEqual(undefined);
});

test("parse unknown message returns undefined", () => {
  expect(parseSignal("oddMessage+2+click+msg")).toStrictEqual(undefined);
});
