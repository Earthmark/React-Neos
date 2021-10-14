/**
 * The core business logic in a handler, this is normally used in conjunction with primitiveDefinitionsToUpdaters.
 */
export interface PrimitiveDefinition<Input, StandardFormat = any> {
  normalize(value: Input): StandardFormat;
  stringify(value: StandardFormat): string;
  equals(a: StandardFormat, b: StandardFormat): boolean;
}

type Optional<T> = T | null | undefined;

/**
 * A handler that is invoked to register a change in a property.
 */
export type PrimitiveUpdater<T> = (
  o: Optional<T>,
  n: Optional<T>,
  d: { diff(o: { type: string; value: string | null }): void }
) => void;

/**
 * A helper function that wraps the core parts of diffing a primitive, calling them using a regular boilerplate.
 *
 * It is suggested to use this function to create a property differ, as it handles edge cases in an expected way.
 *
 * @param primitiveDef The specialized parts of the primitive.
 * @param oldProp The previous value of the property.
 * @param newProp The property that is being assigned.
 * @returns An object if the value changed, containing the new value to assign the property to.
 * If the inner value is null, the value is being reset/undefined. If the wrapper is null, no change was made.
 */
function diffPrimitive<Input, StandardFormat>(
  { normalize, equals, stringify }: PrimitiveDefinition<Input, StandardFormat>,
  oldProp: Optional<Input>,
  newProp: Optional<Input>
): { value: string | null } | null {
  const hasO = oldProp !== undefined && oldProp !== null;
  const hasN = newProp !== undefined && newProp !== null;
  if ((hasO || hasN) && oldProp !== newProp) {
    const no = hasO ? normalize(oldProp) : null;
    const nn = hasN ? normalize(newProp) : null;
    if (no === null || nn === null || !equals(no, nn)) {
      return { value: nn !== null ? stringify(nn) : null };
    }
  }
  return null;
}

/**
 * A helper function for defining a large set of primitives at once, instead of defining them one by one.
 * @param primitiveBases The primitive components to assemble into fully formed primitives, where the type name is the key.
 * @returns An object keyed by the input, where each value is an assembled primitive differ.
 */
export function primitiveDefinitionsToUpdaters<Primitives>(primitiveBases: {
  [TypeName in keyof Primitives]: PrimitiveDefinition<Primitives[TypeName]>;
}): {
  [TypeName in keyof Primitives]: PrimitiveUpdater<Primitives[TypeName]>;
} {
  const result: {
    [TypeName in keyof Primitives]?: PrimitiveUpdater<Primitives[TypeName]>;
  } = {};
  for (const key in primitiveBases) {
    const base = primitiveBases[key];
    result[key] = (oldProp, newProp, delta) => {
      const updater = diffPrimitive(base, oldProp, newProp);
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
