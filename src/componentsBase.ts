import { ReactElement } from "react";
import { PrimitiveUpdater } from "./propsBase";
import { ElementUpdater } from "./renderer";

type Optional<T> = T | null | undefined;

export type ElementDefinition<Props = {}> = {
  [Prop in keyof Props]: ElementPropDefinition<Props[Prop]>;
};

type ElementPropDefinition<T extends { [Prop: string]: any }> = (
  oldProp: Optional<T>,
  newProp: Optional<T>,
  update: { diff(o: { type: string; value: string | null }): void }
) => void;

type UpdaterToProps<U> = U extends ElementUpdater<infer Props> ? Props : never;

function definitionToUpdater<Props>(
  elementDef: ElementDefinition<Props>
): ElementUpdater<Partial<Props>> {
  return (oldProps, newProps, update) => {
    for (const prop in elementDef) {
      elementDef[prop](oldProps[prop], newProps[prop], {
        diff: (delta) => {
          update.diff({ ...delta, prop });
        },
      });
    }
  };
}

/**
 * Converts a set of element definitions into element updaters, ready for use in the NeosRenderer.
 *
 * Argument objects should likely have values from a primitive.* call, as that handles parsing for you.
 *
 * @param definitions A keyed set of element definitions.
 * @returns A keyed set of element updaters.
 */
export function definitionsToUpdaters<DefinitionProperties>(definitions: {
  [Element in keyof DefinitionProperties]: ElementDefinition<
    DefinitionProperties[Element]
  >;
}): {
  [Element in keyof DefinitionProperties]: ElementUpdater<
    Partial<DefinitionProperties[Element]>
  >;
} {
  const result: {
    [Element in keyof DefinitionProperties]?: ElementUpdater<
      Partial<DefinitionProperties[Element]>
    >;
  } = {};
  for (const key in definitions) {
    result[key] = definitionToUpdater(definitions[key]);
  }
  return result as any;
}

export type UpdatersToProps<D> = D extends ElementDefinition<infer Props>
  ? Props
  : never;

/**
 * Extracts the typescript definitions of the properties of a set of element updaters as rendering functions.
 *
 * This is to avoid exposing the elements as globals in a call such as:
 * declare global {
 *   namespace JSX {
 *     interface IntrinsicElements extends ElementProps {}
 *   }
 * }
 *
 * You can use the result of this call in a JSX.IntrinsicElements extension, however it may overlap with existing elements.
 * To avoid this overlap create elements using the object returned by this function.
 *
 * NOTE: The type signature of the result is a lie,
 * a set of strings is returned by typescript recognizes it as a set of functions.
 *
 * @param updaters The set of updaters to map the props from.
 * @returns A map of key -> key, with type definitions that look like React element construction functions.
 */
export function updatersToElements<Updaters>(updaters: Updaters): {
  [Element in keyof Updaters & string]: (
    p: UpdaterToProps<Updaters[Element]>
  ) => React.ReactElement<UpdaterToProps<Updaters[Element]>, Element>;
} {
  return Object.fromEntries(
    Object.keys(updaters).map((e) => [e, e])
  ) as unknown as any;
}

/**
 * A helper function that returns a type declaration that if used in an element definition
 * (and then fed into definitionsToUpdaters) ti imply the element has react children.
 * @returns A type declaration that implies the element has react children.
 */
export function hasReactChildren(): {
  children: PrimitiveUpdater<ReactElement | Array<ReactElement>>;
} {
  return { children: () => null };
}
