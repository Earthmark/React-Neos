import createReconciler, { OutboundSignal } from "./renderer";
import { elementDefs } from "./components";
import { InboundSignal } from "./signalFormatter";

export type ReactNeosRender = (handler: {
  bind(): {
    render(signal?: Array<InboundSignal>): Array<OutboundSignal>;
  };
}) => void;

export default function renderForEach(
  node: React.ReactNode,
  handler: ReactNeosRender
) {
  const reconciler = createReconciler(elementDefs);
  handler({
    bind: () => {
      const b = reconciler.bind();
      return {
        render: (signal) => b.render(node, signal),
      };
    },
  });
}
