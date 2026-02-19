import { IElement, IRelationship } from "@structurizr/dsl";
import cytoscape from "cytoscape";
import { IViewMetadata } from "../containers";
import { EdgeData, GraphAdapter, NodeData } from "./graph";

export const cytoscapeGraph = (): GraphAdapter<
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
        layout: () => {
            const cy = cytoscape({
                headless: true,
                styleEnabled: true,
                elements: {
                    nodes: Object.values(nodes).map((n) => ({
                        data: { id: n.id, parent: n.parent },
                    })),
                    edges: Object.values(edges).map((e) => ({
                        data: { source: e.source, target: e.target },
                    })),
                },
                style: [
                    {
                        selector: "node",
                        style: {
                            width: 200,
                            height: 200,
                            padding: "0",
                        },
                    },
                ],
            });

            const elements: Record<
                string,
                { x: number; y: number; width: number; height: number }
            > = {};

            cy.layout({
                name: "cose",
                animate: false,
                fit: false,
                stop: () => {
                    cy.nodes().forEach((node) => {
                        const bb = node.boundingBox();

                        elements[node.id()] = {
                            x: bb.x1,
                            y: bb.y1,
                            width: bb.w,
                            height: bb.h,
                        };
                    });

                    cy.destroy();
                },
            }).run();

            return Promise.resolve({
                elements: elements,
                relationships: {},
            });
        },
    };
};
