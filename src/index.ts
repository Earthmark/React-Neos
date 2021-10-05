import Renderer from "./NeosRenderer";
import Server from "./Server";
import { stringifySignalArray, parseSignal } from "./SignalFormatter";
import Root from "./Root";

Server(8080, () => {
  const renderer = Renderer();
  return (event) => {
    if (event !== null) {
      const signal = parseSignal(event);
      if (signal !== null) {
        renderer.processEvent(signal);
      }
    }
    return stringifySignalArray(renderer.render(Root()));
  };
});
