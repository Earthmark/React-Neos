export type ElementId = string;

export interface CreateSignal {
  signal: "create";
  id: ElementId;
  type: string;
}

export interface RemoveSignal {
  signal: "remove";
  id: ElementId;
}

export interface PropUpdate<TypeName extends string = string> {
  prop: string;
  type: TypeName;
  value: string | null;
}

export interface UpdateSignal {
  signal: "update";
  id: ElementId;
  props: Array<PropUpdate<any>>;
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

export interface EventSignal {
  signal: "event";
  id: ElementId;
  event: string;
  arg: string;
}

export type InboundSignal = EventSignal;
