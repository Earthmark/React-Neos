import { OutboundSignal, InboundSignal } from "./signal";

export const nullSymbol: "$" = "$";

function stringifyOutboundSignal(signal: OutboundSignal): string {
  switch (signal.signal) {
    case "create":
      return `create+${signal.id}+${signal.type}`;
    case "remove":
      return `remove+${signal.id}`;
    case "update":
      return `update+${signal.id}+${signal.props
        .map(
          (update) =>
            `${update.prop}=${update.type}=${
              update.value === null ? nullSymbol : update.value
            }+`
        )
        .join("")}`;
    case "setParent":
      return `setParent+${signal.id}+${signal.parentId}+${
        signal.after === undefined ? "$" : signal.after
      }`;
  }
}

export function stringifySignalArray(signals: Array<OutboundSignal>): string {
  return signals.map(stringifyOutboundSignal).join("|") + "|";
}
export function parseSignal(signal?: string): Array<InboundSignal> | undefined {
  if (signal === undefined) {
    return undefined;
  }
  const [signalType, id, event, arg] = signal.split("+");
  switch (signalType) {
    case "event":
      return [
        {
          signal: "event",
          id,
          event,
          arg,
        },
      ];
  }
  return undefined;
}
