import { RecordType, loadRecords } from "./storageAdapter.js";
import { forceSimulation, forceManyBody, forceLink, forceCenter } from "d3-force-3d";

export type NodeTypes = RecordType | "asset";

export interface BaseNode {
  id: string,
  label: string,
  type: NodeTypes,
  size: number,
  index?: number,
  x?: number,
  y?: number,
  z?: number,
}

export interface AssetNode extends BaseNode {
  type: "asset",
  records: string[],
}

export interface RecordNode extends BaseNode {
  type: RecordType,
  assets: AssetNode[],
}

export type Node = AssetNode | RecordNode;

interface Vector {
  x: number,
  y: number,
  z: number,
}

export function vecSub(a: Vector, b: Vector): Vector {
  const x = a.x - b.x;
  const y = a.y - b.y;
  const z = a.z - b.z;
  return { x, y, z };
}

export function vecLength(a: Vector): number {
  return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
}

export interface Simulation {
  nodes: Array<Node>,
  links: Array<{ sourceNode: Node, targetNode: Node }>,
  simulation: {
    on(event: "tick" | "end", handler: () => void): void,
    stop(): void,
  }
}

export function createSimulation(path: string): Simulation {
  var rawRecords = loadRecords(path);

  const records: Record<string, RecordNode> = {};
  const assets: Record<string, AssetNode> = {};

  rawRecords.slice(0, 10).forEach(rawRecord => {
    const record: RecordNode = records[rawRecord.id] = {
      id: rawRecord.id,
      label: (rawRecord.path ? rawRecord.path + "\\" : "") + rawRecord.name,
      type: rawRecord.recordType,
      size: 5,
      assets: [],
    };

    rawRecord.neosDBmanifest.forEach(rawAsset => {
      var asset = assets[rawAsset.hash];
      if (asset === undefined) {
        asset = assets[rawAsset.hash] = {
          id: rawAsset.hash,
          label: `${rawAsset.hash} ${rawAsset.bytes} bytes`,
          type: "asset",
          size: rawAsset.bytes,
          records: []
        };
      }
      // Because we go through records in sequence,
      // we can build a strong key out of the order the nodes are referenced.
      asset.records.push(record.id);
      record.assets.push(asset);
    });
  });

  const nodes = [...Object.values(records), ...Object.values(assets)];
  const nodeIndex: Record<string, number> = {};
  nodes.forEach((n, i) => nodeIndex[n.id] = i);
  const links = Object.values(records).flatMap(n =>
    n.assets.map(a => ({ source: nodeIndex[n.id], sourceNode: n, target: nodeIndex[a.id], targetNode: a })));

  console.log("Starting sim of", nodes.length, "nodes and", links.length, "edges");

  const simulation = forceSimulation(nodes, 3)
    .force("charge", forceManyBody())
    .force("link", forceLink(links))
    .force("center", forceCenter())
    .alphaMin(0.1);

  return {
    nodes,
    links,
    simulation
  };
}
