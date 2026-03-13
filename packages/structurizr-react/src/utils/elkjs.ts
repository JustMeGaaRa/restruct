import ELK, { ElkNode, LayoutOptions } from "elkjs/lib/elk.bundled.js";
import { IElement, IRelationship } from "@restruct/structurizr-dsl";
import { IViewMetadata } from "../containers";
import { EdgeData, GraphAdapter, NodeData } from "./graph";

export const elkjsGraph = (): GraphAdapter<
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
        layout: async (): Promise<IViewMetadata> => {
            const elk = new ELK();

            const rootNodes = Object.values(nodes).filter(
                (n) => !parents[n.id]
            );

            const layoutOptions: LayoutOptions = {
                // ALGORITHM: Use the Layered (Sugiyama) algorithm.
                // It is the only choice for directed, flow-based architectural diagrams.
                "elk.algorithm": "layered",
                // DIRECTION: Top-to-Bottom or Left-to-Right.
                "elk.direction": "DOWN",
                // HIERARCHY: 'INCLUDE_CHILDREN' is vital.
                // It enables Global Layering, allowing ELK to optimize edges that cross
                // group boundaries by considering the layout depth-first.
                "elk.hierarchyHandling": "INCLUDE_CHILDREN",
                // CROSSING MINIMIZATION:
                // LAYER_SWEEP is the robust heuristic.
                "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
                // Increase thoroughness (default is ~7) to trade CPU time for fewer crossings.
                "elk.layered.thoroughness": "20",
                // Prioritize optimizing global edges (crossing hierarchy levels).
                "elk.layered.crossingMinimization.hierarchicalSweepiness":
                    "1.0",

                // EDGE ROUTING:
                // ORTHOGONAL creates the "Manhattan" lines required for engineering diagrams.
                "elk.edgeRouting": "ORTHOGONAL",
                // MERGE_EDGES bundles parallel flows, reducing visual clutter ("bus" look).
                "elk.layered.mergeEdges": "true",

                // SPACING:
                // Vertical separation between nodes.
                "elk.spacing.nodeNode": "200",
                // Horizontal separation (length of edges). Critical for label visibility.
                "elk.layered.spacing.nodeNodeBetweenLayers": "200",
                // Distance between parallel edge segments to prevent overlap/coincidence.
                "elk.spacing.edgeEdge": "20",
                // Distance between an edge and a node it does not connect to.
                "elk.spacing.edgeNode": "20",

                // NODE PLACEMENT:
                // BRANDES_KOEPF produces straighter vertical lines and balanced trees
                // compared to NETWORK_SIMPLEX.
                "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
                "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",

                "org.eclipse.elk.padding":
                    "[top=50,left=50,bottom=100,right=50]",

                // PORTS:
                // FIXED_ORDER prevents the "rope twisting" effect where edges cross
                // immediately upon exiting a node.
                // "elk.portConstraints": "FIXED_ORDER",
            };

            const buildElkHierarchy = (
                nodeList: NodeData<IElement>[]
            ): ElkNode[] => {
                return nodeList.map((n) => {
                    const children = Object.values(nodes).filter(
                        (child) => parents[child.id] === n.id
                    );
                    return {
                        id: n.id,
                        width: n.width ?? 200,
                        height: n.height ?? 200,
                        layoutOptions: layoutOptions,
                        children: buildElkHierarchy(children),
                    };
                });
            };

            const elkGraph: ElkNode = {
                id: "root",
                layoutOptions: layoutOptions,
                children: buildElkHierarchy(rootNodes),
                edges: Object.values(edges).map((e) => ({
                    id: e.id,
                    sources: [e.source],
                    targets: [e.target],
                })),
            };

            const layoutedGraph = await elk.layout(elkGraph);

            const elements: Record<
                string,
                { x: number; y: number; width: number; height: number }
            > = {};

            const extractPositions = (node: ElkNode) => {
                if (node.id !== "root") {
                    const x = node.x ?? 0;
                    const y = node.y ?? 0;

                    elements[node.id] = {
                        x: x,
                        y: y,
                        width: node.width ?? 200,
                        height: node.height ?? 200,
                    };

                    if (node.children) {
                        node.children.forEach((child) =>
                            extractPositions(child)
                        );
                    }
                } else if (node.children) {
                    node.children.forEach((child) => extractPositions(child));
                }
            };

            extractPositions(layoutedGraph);

            return {
                elements,
                relationships: {},
            };
        },
    };
};
