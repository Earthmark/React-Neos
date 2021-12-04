import React, { ReactNode } from "react";
import {
  ElementTemplate,
  ElementUpdater,
  ElementRefFactory,
  FieldRefs,
} from "./renderer";
import { ElementProp, ElementRef } from "./propsBase";

export type ElementPropsToUpdaterInput<Fields> = {
  [Field in keyof Fields]: ElementProp<any>;
};

type ElementPropToType<ElemProp> = ElemProp extends ElementProp<infer Value>
  ? Value
  : never;

type MapDefPropToType<T> = {
  [E in keyof T]: ElementPropToType<T[E]>;
};

export function elementPropsToUpdater<
  Fields extends ElementPropsToUpdaterInput<Fields>
>(elementProps: Fields): ElementUpdater<MapDefPropToType<Fields>> {
  return (oldProps, newProps, update) => {
    for (const prop in elementProps) {
      const element = elementProps[prop];
      if (element.field) {
        element.field(oldProps[prop], newProps[prop], {
          diff: (delta) => {
            update.diff({ ...delta, prop });
          },
        });
      }
    }
  };
}

export type ElementPropsToRefFactoryInput<Fields> = {
  [Field in keyof Fields]: ElementRef<any>;
};

type ElementRefToType<ElemRef> = ElemRef extends ElementRef<infer TypeName>
  ? TypeName
  : never;

type MapDefRefToRefType<T> = {
  [E in keyof T]: ElementRefToType<T[E]>;
};

function elementPropsToRefFactory<
  Fields extends ElementPropsToRefFactoryInput<Fields>
>(elementProps: Fields): ElementRefFactory<MapDefRefToRefType<Fields>> {
  return (elementId) => {
    const refs: Partial<FieldRefs<MapDefRefToRefType<Fields>>> = {};
    for (const prop in elementProps) {
      const element = elementProps[prop];
      if (element.ref) {
        refs[prop] = element.ref(elementId, prop);
      }
    }
    return refs as FieldRefs<MapDefRefToRefType<Fields>>;
  };
}

type ElementPropTemplateInput<Props, Refs> =
  | ElementPropsToUpdaterInput<Props>
  | ElementPropsToRefFactoryInput<Refs>;

type FilterByValue<Source, ValueFilter> = {
  [Key in keyof Source as Source[Key] extends ValueFilter
    ? Key
    : never]: Source[Key];
};

type FilterDefinitionToProps<T> = FilterByValue<T, ElementProp<any>>;

type FilterDefinitionToRefs<T> = FilterByValue<T, ElementRef<any>>;

type DefinitionToElementTemplate<Definition> = ElementTemplate<
  MapDefPropToType<FilterDefinitionToProps<Definition>>,
  MapDefRefToRefType<FilterDefinitionToRefs<Definition>>
>;

export function elementPropsToTemplate<
  Definition extends ElementPropTemplateInput<unknown, unknown>
>(definition: Definition): DefinitionToElementTemplate<Definition> {
  return {
    updater: elementPropsToUpdater(
      definition as ElementPropsToUpdaterInput<
        FilterDefinitionToProps<Definition>
      >
    ),
    refFactory: elementPropsToRefFactory(
      definition as ElementPropsToRefFactoryInput<
        FilterDefinitionToRefs<Definition>
      >
    ) as any,
  };
}

/**
 * Converts a set of element definitions into element updaters, ready for use in the NeosRenderer.
 *
 * Argument objects should likely have values from a primitive.* call, as that handles parsing for you.
 *
 * @param definitions A keyed set of element definitions.
 * @returns A keyed set of element updaters.
 *
 */
export function elementPropsSetToTemplates<
  Elements extends {
    [Element in keyof Elements]: ElementPropTemplateInput<unknown, unknown>;
  }
>(
  definitions: Elements
): {
  [Element in keyof Elements]: DefinitionToElementTemplate<Elements[Element]>;
} {
  const result: Partial<{
    [Element in keyof Elements]: DefinitionToElementTemplate<Elements[Element]>;
  }> = {};
  for (const key in definitions) {
    result[key] = elementPropsToTemplate(definitions[key]);
  }
  return result as {
    [Element in keyof Elements]: DefinitionToElementTemplate<Elements[Element]>;
  };
}

type UpdaterToReactElementSignature<
  Element extends string,
  Template
> = Template extends ElementTemplate<infer Props, infer Refs>
  ? ElementTemplateJsxSignature<Props, Refs, Element>
  : never;

type ReactElementSignatureProps<Props, Refs> = Partial<
  Props & { ref: React.Ref<FieldRefs<Refs>> }
>;

type ElementTemplateJsxSignature<Props, Refs, Element extends string> = (
  p: ReactElementSignatureProps<Props, Refs>
) => React.ReactElement<ReactElementSignatureProps<Props, Refs>, Element>;

export type ElementTemplateSetJsxSignatureLibrary<ElementTemplates> = {
  [Element in keyof ElementTemplates]: UpdaterToReactElementSignature<
    Extract<Element, string>,
    ElementTemplates[Element]
  >;
};

export type ElementToRef<Element> = Element extends (p: {
  ref?: React.Ref<infer Refs>;
}) => any
  ? Refs
  : never;

type UseNeosRefResult<RefType> = [
  RefType,
  React.Dispatch<React.SetStateAction<RefType>>
];

export function useNeosRef<
  Element
>(): UseNeosRefResult<ElementToRef<Element> | null> {
  return React.useState<ElementToRef<Element> | null>(null);
}

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
