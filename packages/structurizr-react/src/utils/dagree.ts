import Dagre, { graphlib } from "@dagrejs/dagre";
import { IElement, IRelationship } from "@structurizr/dsl";
import { IViewMetadata } from "../containers";
import { EdgeData, GraphAdapter, NodeData } from "./graph";

export const dagreeGraph = (): GraphAdapter<
    IElement,
    IRelationship,
    IViewMetadata
> => {
    const nodes: Record<string, NodeData<IElement>> = {};
    const edges: Record<string, EdgeData<IRelationship>> = {};
    const parents: Record<string, string> = {};

    return {
        getNode: (nodeId: string) => {
            return nodes[nodeId]!;
        },
        getNodes: () => {
            return Object.values(nodes);
        },
        setParent: (nodeId: string, parentId: string) => {
            parents[nodeId] = parentId;
        },
        setNode: (nodeId: string, node: NodeData) => {
            nodes[nodeId] = node;
        },
        setEdge: (edgeId: string, edge: EdgeData) => {
            edges[edgeId] = edge;
        },
        layout: (): Promise<IViewMetadata> => {
            const graph = new graphlib.Graph({ compound: true })
                .setDefaultEdgeLabel(() => ({}))
                .setGraph({
                    rankdir: "TB",
                    acyclicer: "greedy",
                    ranker: "network-simplex",
                });

            Object.entries(parents).map(([nodeId, parentId]) => {
                graph.setParent(nodeId, parentId);
            });

            Object.entries(nodes).map(([nodeId, node]) => {
                graph.setNode(nodeId, {
                    width: node.width,
                    height: node.height,
                });
            });

            Object.entries(edges).map(([edgeId, edge]) => {
                graph.setEdge(edge.source, edge.target, {});
            });

            Dagre.layout(graph);
            return Promise.resolve({
                elements: Object.fromEntries(
                    graph.nodes().map((nodeId) => {
                        const node = graph.node(nodeId);
                        return [
                            nodeId,
                            {
                                x: node.x,
                                y: node.y,
                                height: node.height,
                                width: node.width,
                            },
                        ];
                    })
                ),
                relationships: {},
            });
        },
    };
};
