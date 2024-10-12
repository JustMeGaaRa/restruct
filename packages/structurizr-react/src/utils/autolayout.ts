import Dagre, { graphlib } from "@dagrejs/dagre";

type Graph = {
    nodes: Node[];
    edges: Edge[];
};

type Node = {
    id: string;
    position: { x: number; y: number };
};

type Edge = {
    source: string;
    target: string;
};

export const autolayout = (reactFlow: Graph): Graph => {
    const graph = new graphlib.Graph()
        .setDefaultEdgeLabel(() => ({}))
        .setGraph({ rankdir: "TB" });

    reactFlow.edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
    reactFlow.nodes.forEach((node) => graph.setNode(node.id, node));

    Dagre.layout(graph, { rankdir: "TB", nodesep: 200, ranksep: 200 });

    return {
        ...reactFlow,
        nodes: reactFlow.nodes.map((node) => {
            const { x, y } = graph.node(node.id);
            return { ...node, position: { x, y } };
        }),
        edges: reactFlow.edges,
    };
};

export const getGraphFromDiagram = (diagram?: {
    scope: { identifier: string } | unknown;
    primaryElements: Array<{ identifier: string }> | any;
    supportingElements: Array<{ identifier: string }> | any;
    relationships: Array<{
        sourceIdentifier: string;
        targetIdentifier: string;
    }>;
}): Graph => {
    if (!diagram) {
        return { nodes: [], edges: [] };
    }

    return {
        nodes: [
            ...diagram.primaryElements.map((element: any) => ({
                id: element.identifier,
                position: { x: 0, y: 0 },
                height: 200,
                width: 200,
            })),
            ...diagram.supportingElements.map((element: any) => ({
                id: element.identifier,
                position: { x: 0, y: 0 },
                height: 200,
                width: 200,
            })),
        ],
        edges: diagram.relationships.map((relationship) => ({
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        })),
    };
};

export const getMetadataFromGraph = (graph: Graph) => {
    return {
        elements: Object.fromEntries(
            graph.nodes.map((node) => [
                node.id,
                {
                    x: node.position.x,
                    y: node.position.y,
                },
            ])
        ),
        relationships: {},
    };
};

export const getMetadataFromDiagram = (diagram?: {
    scope: { identifier: string } | unknown;
    primaryElements: Array<{ identifier: string }> | any;
    supportingElements: Array<{ identifier: string }> | any;
    relationships: Array<{
        sourceIdentifier: string;
        targetIdentifier: string;
    }>;
}) => {
    return getMetadataFromGraph(autolayout(getGraphFromDiagram(diagram)));
};
