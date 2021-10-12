export type STable = Record<string, string>;

// Converts from a string to a map of strings, based on the received format.
const parse = (payload: string): STable => {
  return payload.split("&").reduce<STable>((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[decodeURIComponent(key)] = decodeURIComponent(value);
    return acc;
  }, {});
};

// Converts from a map of strings into a string, encoded based on received format.
const stringify = (payload: STable): string => {
  return Object.entries(payload)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(value)
    )
    .join("&");
};

export default { parse, stringify };
