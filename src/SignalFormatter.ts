type ElementId = string;

export interface CreateSignal {
  signal: "create";
  id: ElementId;
  type: string;
}

export interface RemoveSignal {
  signal: "remove";
  id: ElementId;
}

/* This should allow hard typed event updates.
 * This isn't really worth it right now,
 * as this spreads out primitive parsing.
interface PropUpdate<T extends keyof typeof DeltaSolver> {
  prop: string;
  type: T;
  value: PrimitiveStandard<keyof typeof DeltaSolver[T]>;
}
type PossibleProps = PropUpdate<keyof typeof DeltaSolver>;
*/

export interface PropUpdate {
  prop: string;
  type: string;
  value: string | null;
}

export interface UpdateSignal {
  signal: "update";
  id: ElementId;
  props: Array<PropUpdate>;
}

export interface SetParentSignal {
  signal: "setParent";
  id: ElementId;
  parentId: ElementId;
  after?: ElementId;
}

export type OutboundSignal =
  | CreateSignal
  | RemoveSignal
  | UpdateSignal
  | SetParentSignal;

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
            }`
        )
        .join("+")}`;
    case "setParent":
      return `setParent+${signal.id}+${signal.parentId}+${
        signal.after === undefined ? "$" : signal.after
      }`;
  }
}

export function stringifySignalArray(signals: Array<OutboundSignal>): string {
  return signals.map(stringifyOutboundSignal).join("|");
}

interface EventSignal {
  signal: "event";
  id: ElementId;
  event: string;
  arg: string;
}

export type InboundSignal = EventSignal;

export function parseSignal(signal: string): InboundSignal | null {
  const [signalType, ...args] = signal.split("+");
  switch (signalType) {
    case "event":
      return {
        signal: "event",
        id: args[0],
        event: args[1],
        arg: args[2],
      };
  }
  return null;
}
