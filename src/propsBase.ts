import { ElementProp } from "./componentsBase";

/**
 * The core business logic in a handler, this is normally used in conjunction with propDefinitionsToUpdaters.
 */
export interface PropComponents<Input, Normalized = any> {
  normalize(value: Input, def?: Normalized): Normalized;
  stringify(value: Normalized): string;
  equals(a: Normalized, b: Normalized): boolean;
}

type PropComponentsFactory<Input, Normalized> = (
  def?: Normalized
) => ElementProp<Input>;

interface FieldRef<TypeName> {
  type: TypeName;
  elementId: string;
  name: string;
}

function createRefPropComponents<TypeName>(): PropComponents<
  FieldRef<TypeName>,
  FieldRef<TypeName>
> {
  return {
    normalize: (value) => value,
    stringify: (value) => `${value.elementId}.${value.name}`,
    equals: (a, b) =>
      a.elementId === b.elementId && a.name === b.name && a.type === b.type,
  };
}

type RefBuilder<Value> = (elementId: string, name: string) => FieldRef<Value>;

export interface ElementPropFactory<
  PropTypeName extends string,
  PropType,
  NormalizedPropType = PropType
> {
  indirectRefProp: () => ElementPropFactory<
    `IField<${PropTypeName}>`,
    FieldRef<`IField<${PropTypeName}>`>
  >;
  ref: RefBuilder<PropTypeName>;
  field: PropComponentsFactory<PropType, NormalizedPropType>;
}

export function createRefPropTemplate<PropName extends string>(
  type: PropName
): ElementPropFactory<PropName, FieldRef<PropName>> {
  return {
    indirectRefProp: () => createRefPropTemplate(`IField<${type}>`),
    ref: (elementId, fieldName) => ({ type, elementId, name: fieldName }),
    field: (defaultValue) => (oldValue, newValue, updater) => {
      const prop = diffProp(
        createRefPropComponents(),
        defaultValue,
        oldValue,
        newValue
      );
      if (prop !== null) {
        updater.diff({
          ...prop,
          type,
        });
      }
    },
  };
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

function elementPropComponentsToPropUpdater<
  TypeName extends string,
  PropType,
  NormalizedPropType
>(
  type: TypeName,
  definition: PropComponents<PropType, NormalizedPropType>
): ElementPropFactory<TypeName, PropType, NormalizedPropType> {
  return {
    indirectRefProp: () => createRefPropTemplate(`IField<${type}>`),
    ref: (elementId, name) => ({
      elementId,
      name,
      type: type,
    }),
    field: (def) => (oldProp, newProp, delta) => {
      const updater = diffProp(definition, def, oldProp, newProp);
      if (updater !== null) {
        delta.diff({
          ...updater,
          type: type,
        });
      }
    },
  };
}

type PropFactorySet<Components> = {
  [PropName in keyof Components]: PropComponentsToPropFactory<
    Exclude<PropName, number | symbol>,
    Components[PropName]
  >;
};

type PropComponentsToPropFactory<
  PropType extends string,
  Component
> = Component extends PropComponents<infer Input, infer Normalized>
  ? ElementPropFactory<PropType, Input, Normalized>
  : never;

/**
 * A helper function for defining a large set of props at once, instead of defining them one by one.
 * @param propBases The primitive components to assemble into fully formed props, where the type name is the key.
 * @returns An object keyed by the input, where each value is an assembled prop differ.
 */
export function propComponentsToPropFactories<RawProps>(propBases: RawProps) {
  const result: Partial<PropFactorySet<RawProps>> = {};
  for (const key in propBases) {
    result[key] = elementPropComponentsToPropUpdater(
      key,
      propBases[key] as any
    ) as any;
  }
  return result as PropFactorySet<RawProps>;
}
