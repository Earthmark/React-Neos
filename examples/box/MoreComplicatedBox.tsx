import React from "react";
import n, { useNeosRef } from "react-neos";

interface Vector {
  x: number,
  y: number,
  z: number,
}

function vecSub(a: Vector, b: Vector): Vector {
  const x = a.x - b.x;
  const y = a.y - b.y;
  const z = a.z - b.z;
  return { x, y, z };
}

const MoreComplicatedBox = () => {
  const v = vecSub({ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });

  const [{ material }, matRefGetter] = useNeosRef(n.unlitMaterial);
  const [{ mesh }, meshRefGetter] = useNeosRef(n.boxMesh);

  const [angle, setAngle] = React.useState(() => 0.0);

  React.useEffect(() => {
    var timer = setInterval(() => setAngle(s => s + 1.2), 1000);
    return () => clearInterval(timer);
  });

  const rotation0 = {
    x: Math.atan2(v.x, v.y) * (180 / Math.PI) + angle,
    y: Math.atan2(v.x, v.z) * (180 / Math.PI)
  }
  const rotation1 = {
    x: Math.atan2(v.x, v.y) * (180 / Math.PI) + angle + 240,
    y: Math.atan2(v.x, v.z) * (180 / Math.PI)
  }
  const rotation2 = {
    x: Math.atan2(v.x, v.y) * (180 / Math.PI) + angle + 120,
    y: Math.atan2(v.x, v.z) * (180 / Math.PI)
  }

  return <n.transform>
    <n.unlitMaterial color={{ r: 0.25 }} ref={matRefGetter} />
    <n.boxMesh ref={meshRefGetter} size={{ x: 0.1, y: 0.1, z: 0.3 }} />
    <n.transform rotation={rotation0}>
      <n.meshRenderer position={{ z: 0.4 }} mesh={mesh} material={material} />
    </n.transform>
    <n.transform rotation={rotation1}>
      <n.meshRenderer position={{ z: 0.4 }} mesh={mesh} material={material} />
    </n.transform>
    <n.transform rotation={rotation2}>
      <n.meshRenderer position={{ z: 0.4 }} mesh={mesh} material={material} />
    </n.transform>
  </n.transform>;
}

export default MoreComplicatedBox;
