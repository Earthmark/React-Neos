import React from "react";
import n, { useNeosRef } from "react-neos";
import { createSimulation, NodeTypes, Node } from "./assetGraphSimulation.js";

const AssetGraph = ({path}: {path: string}) => {
    const simulation = React.useMemo(() => createSimulation(path), []);
    const [kickValue, kicker] = React.useState(false);
    React.useEffect(() => {
        simulation.simulation.on("end", () => kicker(true));
        return simulation.simulation.stop
    }, [simulation]);

    const [assetMat, setAssetMat] = useNeosRef(n.unlitMaterial);
    const [objectMat, setObjectMat] = useNeosRef(n.unlitMaterial);
    const [worldMat, setWorldMat] = useNeosRef(n.unlitMaterial);
    const [audioMat, setAudioMat] = useNeosRef(n.unlitMaterial);
    const [textureMat, setTextureMat] = useNeosRef(n.unlitMaterial);
    const [mesh, setMesh] = useNeosRef(n.sphereMesh)

    const getMaterial = (type: NodeTypes) => {
        switch(type) {
          case "asset": return assetMat;
          case "audio": return audioMat;
          case "object": return objectMat;
          case "texture": return textureMat;
          case "world": return worldMat;  
        }
    };

    return <n.transform>
        <n.transform>
            {
            simulation.nodes.map((node: Node) => {
                const relativeScale = Math.log(node.size);
                return <n.transform key={node.id} position={node} scale={{x: relativeScale, y: relativeScale, z: relativeScale}}>
                    <n.meshRenderer mesh={mesh.mesh} material={getMaterial(node.type)?.material} />
                </n.transform>
            })
            }
        </n.transform>
        <n.transform>
            <n.unlitMaterial color={{r: 1}} ref={setAssetMat} />
            <n.unlitMaterial color={{g: 1}} ref={setObjectMat} />
            <n.unlitMaterial color={{b: 1}} ref={setWorldMat} />
            <n.unlitMaterial color={{r: 1, g: 1}} ref={setAudioMat} />
            <n.unlitMaterial color={{r: 1, b: 1}} ref={setTextureMat} />
            <n.boxMesh ref={setMesh} size={{x: 0.1, y: 0.1, z: 0.1}} />
        </n.transform>
    </n.transform>;
}

export default AssetGraph;
