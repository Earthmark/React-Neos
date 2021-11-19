import { ReactNode } from "react";
import { ElementTemplate, ElementUpdater } from "./renderer";

export type ElementProp<Value, Type extends string = string> = (
  oldProp: Value | undefined,
  newProp: Value | undefined,
  update: { diff(o: { type: Type; value: string | null }): void }
) => void;

export type ElementProps<Props = {}> = {
  [Prop in keyof Props]: ElementProp<Props[Prop]>;
};

function elementPropsToUpdater<Props>(
  elementProps: ElementProps<Props>
): ElementUpdater<Props> {
  return (oldProps, newProps, update) => {
    for (const prop in elementProps) {
      elementProps[prop](oldProps[prop], newProps[prop], {
        diff: (delta) => {
          update.diff({ ...delta, prop });
        },
      });
    }
  };
}

type ElementPropsSet<ElementPropsSets> = {
  [Element in keyof ElementPropsSets]: ElementProps<ElementPropsSets[Element]>;
};

type ElementTemplateSet<ElementPropsSets> = {
  [Element in keyof ElementPropsSets]: ElementTemplate<
    ElementPropsSets[Element],
    any
  >;
};

/**
 * Converts a set of element definitions into element updaters, ready for use in the NeosRenderer.
 *
 * Argument objects should likely have values from a primitive.* call, as that handles parsing for you.
 *
 * @param definitions A keyed set of element definitions.
 * @returns A keyed set of element updaters.
 */
export function elementPropsSetToTemplates<ElementPropSets>(
  definitions: ElementPropsSet<ElementPropSets>
): ElementTemplateSet<ElementPropSets> {
  const result: Partial<ElementTemplateSet<ElementPropSets>> = {};
  for (const key in definitions) {
    result[key] = elementPropsToTemplate(definitions[key]);
  }
  return result as ElementTemplateSet<ElementPropSets>;
}

function elementPropsToTemplate<Props, Refs>(
  definition: ElementProps<Props>
): ElementTemplate<Props> {
  return {
    updater: elementPropsToUpdater(definition),
    refFactory: (id) => ({} as Refs),
  };
}

type UpdaterToProps<U> = U extends ElementTemplate<infer Props, any>
  ? Props
  : never;

type ElementTemplateJsxSignature<Props, Element extends string> = (
  p: Props
) => React.ReactElement<Props, Element>;

export type ElementTemplateSetJsxSignatureLibrary<ElementTemplates> = {
  [Element in keyof ElementTemplates & string]: ElementTemplateJsxSignature<
    Partial<UpdaterToProps<ElementTemplates[Element]>>,
    Element
  >;
};

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
 * @param templates The set of element templates to map the props from.
 * @returns A map of key -> key, with type definitions that look like React element construction functions.
 */
export function elementTemplatesToJsxPrototypes<ElementTemplates>(
  templates: ElementTemplates
): ElementTemplateSetJsxSignatureLibrary<ElementTemplates> {
  return Object.fromEntries(
    Object.keys(templates).map((e) => [e, e])
  ) as unknown as any;
}

/**
 * A helper function that returns a type declaration that if used in an element definition
 * (and then fed into definitionsToUpdaters) ti imply the element has react children.
 * @returns A type declaration that implies the element has react children.
 */
export function hasReactChildren(): {
  children: ElementProp<ReactNode>;
} {
  return {} as unknown as any;
}
