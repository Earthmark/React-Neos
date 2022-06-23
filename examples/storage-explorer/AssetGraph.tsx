import React from "react";
import n, { useNeosRef } from "react-neos";
import { createSimulation, NodeTypes } from "./assetGraphSimulation.js";
import { Quaternion, Vector3, Euler } from "three";

function toVec({x, y, z}: {x?: number, y?: number, z?: number}): Vector3 {
  return new Vector3(x, y, z)
}

const AssetGraph = ({ path }: { path: string }): JSX.Element => {
  const simulation = React.useMemo(() => createSimulation(path), []);

  const [kickValue, kicker] = React.useState(0);
  React.useEffect(() => {
    simulation.simulation.on("end", () => kicker(2));
    return simulation.simulation.stop
  }, [simulation]);

  const [assetMat, setAssetMat] = useNeosRef(n.pbsSpecularMaterial);
  const [objectMat, setObjectMat] = useNeosRef(n.pbsSpecularMaterial);
  const [worldMat, setWorldMat] = useNeosRef(n.pbsSpecularMaterial);
  const [audioMat, setAudioMat] = useNeosRef(n.pbsSpecularMaterial);
  const [textureMat, setTextureMat] = useNeosRef(n.pbsSpecularMaterial);
  const [linkMat, setLinkMat] = useNeosRef(n.pbsSpecularMaterial);
  const [nodeMesh, setNodeMesh] = useNeosRef(n.sphereMesh)
  const [linkMesh, setLinkMesh] = useNeosRef(n.sphereMesh)

  const getMaterial = (type: NodeTypes) => {
    switch (type) {
      case "asset": return assetMat;
      case "audio": return audioMat;
      case "object": return objectMat;
      case "texture": return textureMat;
      case "world": return worldMat;
    }
  };

  // If the material was initialized, start loading slots.
  React.useEffect(() => {
    if (kickValue === 0) {
      kicker(1)
    }
  }, [assetMat.material])

  return <React.Fragment>
    <n.transform scale={{ x: 0.1, y: 0.1, z: 0.1 }}>
      {
        kickValue > 0 ?
        simulation.nodes.map(node => {
          const relativeScale = Math.log(node.size);
          var nodes = [];
          if (node.type !== "asset") {
            nodes = node.assets.map(asset => {
              const v = toVec(asset).sub(toVec(node));
              const length = v.length();
              const rotation = new Quaternion();
              rotation.setFromUnitVectors(new Vector3(1), v.normalize());
              const euler = new Euler().setFromQuaternion(rotation);
              return <n.transform key={asset.id} scale={{ x: length }} rotation={{
                  x: euler.x * (180/Math.PI),
                  y: euler.y * (180/Math.PI),
                  z: euler.z * (180/Math.PI),
                }}>
                  <n.meshRenderer mesh={linkMesh.mesh} material={linkMat.material}
                  position={{ x: 0.5 }} />
                </n.transform>
            })
          }
          return <n.transform key={node.id} position={{ x: node.x, y: node.y, z: node.z }}>
            <n.meshRenderer mesh={nodeMesh.mesh} material={getMaterial(node.type)?.material} scale={{ x: relativeScale, y: relativeScale, z: relativeScale }} />
            {nodes}
          </n.transform>
        }) : []
      }
    </n.transform>
    <n.transform name="Assets">
      <n.pbsSpecularMaterial ref={setAssetMat} name="Asset Material" color={{ r: 1 }} />
      <n.pbsSpecularMaterial ref={setObjectMat} name="Object Material" color={{ g: 1 }} />
      <n.pbsSpecularMaterial ref={setWorldMat} name="World Material" color={{ b: 1 }} />
      <n.pbsSpecularMaterial ref={setAudioMat} name="Audio Material" color={{ r: 1, g: 1 }} />
      <n.pbsSpecularMaterial ref={setTextureMat} name="Texture Material" color={{ r: 1, b: 1 }} />
      <n.pbsSpecularMaterial ref={setLinkMat} name="Link Material" color={{ r: 0.5, b: 0.5, g: 0.5 }} />
      <n.boxMesh ref={setNodeMesh} name="Node Mesh" size={{ x: 1, y: 1, z: 1 }} />
      <n.boxMesh ref={setLinkMesh} name="Link Mesh" size={{ x: 1, y: 0.25, z: 0.25 }} />
    </n.transform>
  </React.Fragment>;
}

export default AssetGraph;
