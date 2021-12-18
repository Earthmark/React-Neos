import React from "react";
import n, { useNeosRef } from "react-neos";

const MoreComplicatedBox = () => {
  const [matRef, matRefGetter] = useNeosRef(n.unlitMaterial);
  const [meshRef, meshRefGetter] = useNeosRef(n.boxMesh);

  return <n.transform>
    <n.unlitMaterial color={{r: 0.25}} ref={matRefGetter} />
    <n.boxMesh ref={meshRefGetter} />
    <n.meshRenderer mesh={meshRef.self} material={matRef.self} />
  </n.transform>;
}

export default MoreComplicatedBox;
