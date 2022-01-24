import React from "react";
import n, { useNeosRef } from "react-neos";

const MoreComplicatedBox = () => {
  const [{material}, matRefGetter] = useNeosRef(n.unlitMaterial);
  const [{mesh}, meshRefGetter] = useNeosRef(n.boxMesh);

  return <n.transform>
    <n.unlitMaterial color={{r: 0.25}} ref={matRefGetter} />
    <n.boxMesh ref={meshRefGetter} size={{x: 0.4, y: 0.15}} />
    <n.meshRenderer mesh={mesh} material={material} />
  </n.transform>;
}

export default MoreComplicatedBox;
