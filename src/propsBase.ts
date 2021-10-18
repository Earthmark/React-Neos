/**
 * The core business logic in a handler, this is normally used in conjunction with propDefinitionsToUpdaters.
 */
export interface PropDefinition<Input> {
  stringify(value: Input): string;
  equals(a: Input, b: Input): boolean;
}

type Optional<T> = T | undefined;

/**
 * A handler that is invoked to register a change in a property.
 */
export type PropUpdater<T> = (
  o: Optional<T>,
  n: Optional<T>,
  d: { diff(o: { type: string; value: string | null }): void }
) => void;

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
function diffProp<Input>(
  { equals, stringify }: PropDefinition<Input>,
  oldProp: Optional<Input>,
  newProp: Optional<Input>
): { value: string | null } | null {
  const hasO = oldProp !== undefined;
  const hasN = newProp !== undefined;
  if ((hasO || hasN) && (!hasO || !hasN || !equals(oldProp, newProp))) {
    return { value: hasN ? stringify(newProp) : null };
  }
  return null;
}

/**
 * A helper function for defining a large set of props at once, instead of defining them one by one.
 * @param propBases The primitive components to assemble into fully formed props, where the type name is the key.
 * @returns An object keyed by the input, where each value is an assembled prop differ.
 */
export function propDefinitionsToUpdaters<Props>(propBases: {
  [PropName in keyof Props]: PropDefinition<Props[PropName]>;
}): {
  [PropName in keyof Props]: PropUpdater<Props[PropName]>;
} {
  const result: {
    [PropName in keyof Props]?: PropUpdater<Props[PropName]>;
  } = {};
  for (const key in propBases) {
    const base = propBases[key];
    result[key] = (oldProp, newProp, delta) => {
      const updater = diffProp(base, oldProp, newProp);
      if (updater !== null) {
        delta.diff({
          ...updater,
          type: key,
        });
      }
    };
  }
  return result as any;
}
