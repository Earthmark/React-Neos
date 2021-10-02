import UrlEncode from "./UrlEncode";

const testCases: [any, string][] = [
  [{ a: "b", c: "d" }, "a=b&c=d"],
  [
    { a: "b", tacos_tasty: "who really $#@%@#!432" },
    "a=b&tacos_tasty=who%20really%20%24%23%40%25%40%23!432",
  ],
];

test("stringify conversions", () => {
  for (const [obj, str] of testCases) {
    expect(UrlEncode.stringify(obj)).toStrictEqual(str);
  }
});

test("parse conversions", () => {
  for (const [obj, str] of testCases) {
    expect(UrlEncode.parse(str)).toStrictEqual(obj);
  }
});

test("Round trip conversions starting at string", () => {
  for (const [obj, str] of testCases) {
    expect(UrlEncode.stringify(UrlEncode.parse(str))).toStrictEqual(str);
  }
});

test("Round trip conversions starting at object", () => {
  for (const [obj, str] of testCases) {
    expect(UrlEncode.parse(UrlEncode.stringify(obj))).toStrictEqual(obj);
    expect(UrlEncode.stringify(UrlEncode.parse(str))).toStrictEqual(str);
  }
});
