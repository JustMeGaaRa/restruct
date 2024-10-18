import Dagre, { graphlib } from "@dagrejs/dagre";
import { isGroup } from "@structurizr/dsl";

type Graph = {
    nodes: Node[];
    edges: Edge[];
};

type Node = {
    id: string;
    position: { x: number; y: number };
    height: number;
    width: number;

    nodes?: Node[];
};

type Edge = {
    source: string;
    target: string;
};

export const autolayout = (graph: Graph): Graph => {
    const dagreGraph = new graphlib.Graph({ compound: true })
        .setDefaultEdgeLabel(() => ({}))
        .setGraph({ rankdir: "TB" });

    graph.edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
    graph.nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            label: "",
            height: node.height,
            width: node.width,
        });

        if (node.nodes) {
            node.nodes.forEach((subnode) => {
                dagreGraph.setParent(subnode.id, node.id);
                dagreGraph.setNode(subnode.id, subnode);
            });
        }
    });

    Dagre.layout(dagreGraph, {
        rankdir: "TB",
        nodesep: 200,
        ranksep: 200,
        acyclicer: "greedy",
        ranker: "longest-path",
    });

    return {
        nodes: graph.nodes.map((node) => {
            const { x, y, height, width } = dagreGraph.node(node.id);
            return { ...node, position: { x, y }, height, width };
        }),
        edges: graph.edges,
    };
};

type Element = { identifier: string };
type Relationship = {
    sourceIdentifier: string;
    targetIdentifier: string;
};

function isElement(element: any): element is { identifier: string } {
    return element.identifier !== undefined;
}

export const getGraphFromDiagram = (diagram?: {
    scope: Element | unknown;
    primaryElements: Array<Element | unknown>;
    supportingElements: Array<Element | unknown>;
    relationships: Array<Relationship>;
}): Graph => {
    if (!diagram) {
        return { nodes: [], edges: [] };
    }

    const defaultPosition = { x: 0, y: 0 };
    const defaultSize = { height: 200, width: 200 };

    return {
        nodes: [
            ...diagram.primaryElements.filter(isGroup).flatMap((element) => [
                ...element.people.filter(isElement).map((element) => ({
                    id: element.identifier,
                    position: defaultPosition,
                    ...defaultSize,
                })),
                ...element.softwareSystems.filter(isElement).map((element) => ({
                    id: element.identifier,
                    position: defaultPosition,
                    ...defaultSize,
                })),
                ...element.containers.filter(isElement).map((element) => ({
                    id: element.identifier,
                    position: defaultPosition,
                    ...defaultSize,
                })),
                ...element.components.filter(isElement).map((element) => ({
                    id: element.identifier,
                    position: defaultPosition,
                    ...defaultSize,
                })),
            ]),
            ...diagram.primaryElements.filter(isElement).map((element) => ({
                id: element.identifier,
                position: defaultPosition,
                ...defaultSize,
            })),
            ...diagram.supportingElements.filter(isElement).map((element) => ({
                id: element.identifier,
                position: defaultPosition,
                ...defaultSize,
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
                    height: node.height,
                    width: node.width,
                },
            ])
        ),
        relationships: {},
    };
};

export const getMetadataFromDiagram = (diagram?: {
    scope: Element | unknown;
    primaryElements: Array<Element | unknown>;
    supportingElements: Array<Element | unknown>;
    relationships: Array<Relationship>;
}) => {
    return getMetadataFromGraph(autolayout(getGraphFromDiagram(diagram)));
};
