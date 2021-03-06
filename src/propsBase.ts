import { PropUpdate } from "./signal.js";
import { FieldRef } from "./renderer.js";

/**
 * The core business logic in a handler, this is normally used in conjunction with propDefinitionsToUpdaters.
 */
export interface PropComponents<Input, Normalized = Input> {
  normalize(value: Input, def?: Normalized): Normalized;
  stringify(value: Normalized): string;
  equals(a: Normalized, b: Normalized): boolean;
}

export interface ElementProp<Value> {
  field: (
    oldProp: Value | undefined,
    newProp: Value | undefined,
    update: {
      diff(o: Omit<PropUpdate, "prop">): void;
    }
  ) => void;
}

export interface ElementRef<TypeName extends string> {
  ref: (elementId: string, name: string) => FieldRef<TypeName>;
}

function createRefPropComponents<TypeName extends string>(): PropComponents<
  FieldRef<TypeName>
> {
  return {
    normalize: (value) => value,
    stringify: (value) => `${value.elementId}.${value.name}`,
    equals: (a, b) =>
      a.elementId === b.elementId && a.name === b.name && a.type === b.type,
  };
}

type RefBuilder<TypeName extends string> = () => ElementRef<TypeName>;

type FieldBuilder<Input, Normalized> = (def?: Normalized) => ElementProp<Input>;

type RefFieldBuilder<TypeName extends string, Input, Normalized> = (
  def?: Normalized
) => ElementRef<TypeName> & ElementProp<Input>;

export interface ElementPropFactory<
  TypeName extends string,
  Input,
  Normalized = Input
> {
  indirectRefProp: () => ElementPropFactory<
    `IField<${TypeName}>`,
    FieldRef<`IField<${TypeName}>`>
  >;
  ref: RefBuilder<TypeName>;
  field: FieldBuilder<Input, Normalized>;
  refField: RefFieldBuilder<TypeName, Input, Normalized>;
}

/**
 * A helper function that wraps the core parts of diffing a prop, calling them using a regular boilerplate.
 *
 * It is suggested to use this function to create a property differ, as it handles edge cases in an expected way.
 *
 * @param propDef The specialized parts of the prop.
 * @param oldProp The previous value of the property.
 * @param newProp The property that is being assigned.
 * @returns An object if the value changed, containing the new value to assign the property to.
 * If the inner value is null, the value is being reset/undefined. If the wrapper is null, no change was made.
 */
function diffProp<Input, Normalized>(
  { equals, stringify, normalize }: PropComponents<Input, Normalized>,
  def: Normalized | undefined,
  oldProp: Input | undefined,
  newProp: Input | undefined
): { value: string | null } | null {
  const n = newProp !== undefined ? normalize(newProp, def) : undefined;
  const hasO = oldProp !== undefined;
  const hasN = n !== undefined;
  if ((hasO || hasN) && (!hasO || !hasN || !equals(normalize(oldProp), n))) {
    return { value: hasN ? stringify(n) : null };
  }
  return null;
}

function makeRefBuilder<TypeName extends string>(
  type: TypeName
): RefBuilder<TypeName> {
  return () => ({
    ref: (elementId, name) => ({
      elementId,
      name,
      type,
    }),
  });
}

function makeFieldBuilder<Input, Normalized>(
  type: string,
  definition: PropComponents<Input, Normalized>
): FieldBuilder<Input, Normalized> {
  return (def) => ({
    field: (oldProp, newProp, delta) => {
      const updater = diffProp(definition, def, oldProp, newProp);
      if (updater !== null) {
        delta.diff({
          ...updater,
          type,
        });
      }
    },
  });
}

function makeRefFieldBuilder<TypeName extends string, Input, Normalized>(
  refBuilder: RefBuilder<TypeName>,
  fieldBuilder: FieldBuilder<Input, Normalized>
): RefFieldBuilder<TypeName, Input, Normalized> {
  return (def) => ({
    ...refBuilder(),
    ...fieldBuilder(def),
  });
}

function elementPropComponentsToPropUpdater<
  TypeName extends string,
  Input,
  Normalized
>(
  type: TypeName,
  definition: PropComponents<Input, Normalized>
): ElementPropFactory<TypeName, Input, Normalized> {
  const ref = makeRefBuilder(type);
  const field = makeFieldBuilder(type, definition);
  return {
    indirectRefProp: () => createRefPropFactory(`IField<${type}>`),
    ref,
    field,
    refField: makeRefFieldBuilder(ref, field),
  };
}

export type ElementRefFactory<TypeName extends string> = ElementPropFactory<
  TypeName,
  FieldRef<TypeName>
>;

const refPropComponents = createRefPropComponents();

export function createRefPropFactory<TypeName extends string>(
  type: TypeName
): ElementRefFactory<TypeName> {
  const ref = makeRefBuilder(type);
  const field = makeFieldBuilder("ref", refPropComponents);
  return {
    indirectRefProp: () => createRefPropFactory(`IField<${type}>`),
    ref,
    field,
    refField: makeRefFieldBuilder(ref, field),
  };
}

type FactoryForComponent<
  TypeName extends string,
  Components
> = Components extends PropComponents<infer Input, infer Normalized>
  ? ElementPropFactory<TypeName, Input, Normalized>
  : never;

/**
 * A helper function for defining a large set of props at once, instead of defining them one by one.
 * @param propBases The primitive components to assemble into fully formed props, where the type name is the key.
 * @returns An object keyed by the input, where each value is an assembled prop differ.
 */
export function propComponentsToPropFactories<
  FactoryComponents extends {
    [Prop in keyof FactoryComponents]: PropComponents<unknown, unknown>;
  }
>(
  propBases: FactoryComponents
): {
  [PropType in Extract<keyof FactoryComponents, string>]: FactoryForComponent<
    PropType,
    FactoryComponents[PropType]
  >;
} {
  const result: Partial<{
    [PropType in Extract<keyof FactoryComponents, string>]: FactoryForComponent<
      PropType,
      FactoryComponents[PropType]
    >;
  }> = {};
  for (const key in propBases) {
    result[key] = elementPropComponentsToPropUpdater(
      key,
      propBases[key]
    ) as any;
  }
  return result as {
    [PropType in Extract<keyof FactoryComponents, string>]: FactoryForComponent<
      PropType,
      FactoryComponents[PropType]
    >;
  };
}

export function refComponentsToRefFactories<
  RefComponents extends {
    [Ref in keyof RefComponents]: Extract<any, string>;
  }
>(
  refs: RefComponents
): {
  [RefType in Extract<keyof RefComponents, string>]: ElementRefFactory<
    RefComponents[RefType]
  >;
} {
  const result: Partial<{
    [RefType in keyof RefComponents]: ElementRefFactory<RefComponents[RefType]>;
  }> = {};
  for (const key in refs) {
    result[key] = createRefPropFactory(refs[key]);
  }
  return result as {
    [RefType in keyof RefComponents]: ElementRefFactory<RefComponents[RefType]>;
  };
}
