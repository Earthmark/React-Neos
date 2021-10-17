import createReconciler, { OutboundSignal } from "./renderer";
import { elementDefs } from "./components";
import { InboundSignal } from "./signalFormatter";

export interface ReactNeosRenderHandler {
  bind(): {
    render(signal?: Array<InboundSignal>): Array<OutboundSignal>;
  };
}

export default function createRender(
  node: React.ReactNode
): ReactNeosRenderHandler {
  const reconciler = createReconciler(elementDefs);
  return {
    bind: () => {
      const b = reconciler.bind();
      return {
        render: (signal) => b.render(node, signal),
      };
    },
  };
}
