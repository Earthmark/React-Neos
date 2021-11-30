import { ReactNode } from "react";
import {
  ElementTemplate,
  ElementUpdater,
  ElementRefFactory,
  FieldRefs,
  FieldRef,
} from "./renderer";
import { ElementProp, ElementRef } from "./propsBase";

export type ElementPropsToUpdaterInput<Fields> = {
  [Field in keyof Fields]: ElementProp<string, any>;
};

type ElementPropToProp<ElemProp> = ElemProp extends ElementProp<
  infer TypeName,
  infer Value
>
  ? Value
  : never;

type ElementPropsToProps<Fields> = {
  [Field in keyof Fields]: ElementPropToProp<Fields[Field]>;
};

export function elementPropsToUpdater<
  Fields extends ElementPropsToUpdaterInput<Fields>
>(elementProps: Fields): ElementUpdater<ElementPropsToProps<Fields>> {
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
  [Field in keyof Fields]: ElementRef<string>;
};

type ElementPropsToRefs<Fields> = {
  [Field in keyof Fields]: Fields[Field] extends ElementRef<infer TypeName>
    ? TypeName
    : never;
};

function elementPropsToRefFactory<
  Fields extends ElementPropsToRefFactoryInput<Fields>
>(elementProps: Fields): ElementRefFactory<ElementPropsToRefs<Fields>> {
  return (elementId) => {
    const refs: Partial<FieldRefs<ElementPropsToRefs<Fields>>> = {};
    for (const prop in elementProps) {
      const element = elementProps[prop];
      if (element.ref) {
        refs[prop] = element.ref(elementId);
      }
    }
    return refs as FieldRefs<ElementPropsToRefs<Fields>>;
  };
}

type ElementPropTemplateInput<Fields> =
  | ElementPropsToUpdaterInput<Fields>
  | ElementPropsToRefFactoryInput<Fields>;

export function elementPropsToTemplate<
  Definition extends ElementPropTemplateInput<Definition>
>(
  definition: Definition
): ElementTemplate<
  ElementPropsToProps<
    Extract<Definition, ElementPropsToUpdaterInput<Definition>>
  >,
  ElementPropsToRefs<
    Extract<Definition, ElementPropsToRefFactoryInput<Definition>>
  >
> {
  return {
    updater: elementPropsToUpdater(
      definition as ElementPropsToUpdaterInput<Definition>
    ),
    refFactory: elementPropsToRefFactory(
      definition as ElementPropsToRefFactoryInput<Definition>
    ),
  };
}

type ElementPropsToTemplateSig = typeof elementPropsToTemplate;

/**
 * Converts a set of element definitions into element updaters, ready for use in the NeosRenderer.
 *
 * Argument objects should likely have values from a primitive.* call, as that handles parsing for you.
 *
 * @param definitions A keyed set of element definitions.
 * @returns A keyed set of element updaters.
 */
export function elementPropsSetToTemplates<
  Elements extends {
    [Element in keyof Elements]: ElementPropTemplateInput<Elements[Element]>;
  }
>(definitions: Elements) {
  const result: Partial<{
    [Element in keyof Elements]: ReturnType<
      ElementPropsToTemplateSig<Elements[Element]>
    >;
  }> = {};
  for (const key in definitions) {
    result[key] = elementPropsToTemplate(definitions[key]) as any;
  }
  return result as Required<typeof result>;
}

type UpdaterToReactElementSignature<
  Element extends string,
  Template
> = Template extends ElementTemplate<infer Props, infer Refs>
  ? ElementTemplateJsxSignature<Props, Refs, Element>
  : never;

type ElementTemplateJsxSignature<Props, Refs, Element extends string> = (
  p: Props
) => React.ReactElement<Partial<Props & { ref: React.Ref<Refs> }>, Element>;

export type ElementTemplateSetJsxSignatureLibrary<ElementTemplates> = {
  [Element in keyof ElementTemplates & string]: UpdaterToReactElementSignature<
    Element,
    ElementTemplates[Element]
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
  children: ElementProp<"children", ReactNode>;
} {
  return {} as unknown as any;
}
