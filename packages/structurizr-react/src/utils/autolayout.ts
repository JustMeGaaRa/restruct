import Dagre, { graphlib } from "@dagrejs/dagre";
import {
    IComponentDiagram,
    IContainerDiagram,
    ISystemContextDiagram,
    ISystemLandscapeDiagram,
    ViewType,
} from "@structurizr/dsl";
import { IViewMetadata } from "../containers";

type Diagram =
    | ISystemLandscapeDiagram
    | ISystemContextDiagram
    | IContainerDiagram
    | IComponentDiagram;

export const autolayout = (
    diagram: Diagram,
    viewType: ViewType
): IViewMetadata => {
    const dagreGraph = new graphlib.Graph({ compound: true })
        .setDefaultEdgeLabel(() => ({}))
        .setGraph({
            rankdir: "TB",
            acyclicer: "greedy",
            ranker: "network-simplex",
        });

    if (viewType === ViewType.SystemLandscape) {
        buildGraphFromSystemLandscapeDiagram(
            diagram as ISystemLandscapeDiagram,
            dagreGraph
        );
    } else if (viewType === ViewType.SystemContext) {
        buildGraphFromSystemContextDiagram(
            diagram as ISystemContextDiagram,
            dagreGraph
        );
    } else if (viewType === ViewType.Container) {
        buildGraphFromContainerDiagram(
            diagram as IContainerDiagram,
            dagreGraph
        );
    } else if (viewType === ViewType.Component) {
        buildGraphFromComponentDiagram(
            diagram as IComponentDiagram,
            dagreGraph
        );
    }

    Dagre.layout(dagreGraph);

    return buildMetadataFromGraph(dagreGraph);
};

const defaultPosition = { x: 0, y: 0 };
const defaultSize = { height: 200, width: 200 };

export const buildGraphFromSystemLandscapeDiagram = (
    diagram: ISystemLandscapeDiagram,
    graph: graphlib.Graph
) => {
    [diagram.scope].map((scope) => {
        scope.groups.flatMap((group) => {
            group.people.map((element) => {
                graph.setNode(element.identifier, {
                    label: "",
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
            group.softwareSystems.map((element) => {
                graph.setNode(element.identifier, {
                    label: "",
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.softwareSystems.map((element) => {
            graph.setNode(element.identifier, {
                label: "",
                ...defaultSize,
                ...defaultPosition,
            });
        });

        scope.people.map((element) => {
            graph.setNode(element.identifier, {
                label: "",
                ...defaultSize,
                ...defaultPosition,
            });
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(
            relationship.sourceIdentifier,
            relationship.targetIdentifier
        );
    });
};

export const buildGraphFromSystemContextDiagram = (
    diagram: ISystemContextDiagram,
    graph: graphlib.Graph
) => {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            label: "",
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            label: "",
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(
            relationship.sourceIdentifier,
            relationship.targetIdentifier
        );
    });
};

export const buildGraphFromContainerDiagram = (
    diagram: IContainerDiagram,
    graph: graphlib.Graph
) => {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            label: "",
            ...defaultSize,
            ...defaultPosition,
        });

        scope.groups.flatMap((group) => {
            group.containers.map((element) => {
                graph.setNode(element.identifier, {
                    label: "",
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.containers.map((element) => {
            graph.setNode(element.identifier, {
                label: "",
                ...defaultSize,
                ...defaultPosition,
            });
            graph.setParent(element.identifier, scope.identifier);
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            label: "",
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(
            relationship.sourceIdentifier,
            relationship.targetIdentifier
        );
    });
};

export const buildGraphFromComponentDiagram = (
    diagram: IComponentDiagram,
    graph: graphlib.Graph
) => {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            label: "",
            ...defaultSize,
            ...defaultPosition,
        });

        scope.groups.flatMap((group) => {
            group.components.map((element) => {
                graph.setNode(element.identifier, {
                    label: "",
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.components.map((element) => {
            graph.setNode(element.identifier, {
                label: "",
                ...defaultSize,
                ...defaultPosition,
            });
            graph.setParent(element.identifier, scope.identifier);
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            label: "",
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(
            relationship.sourceIdentifier,
            relationship.targetIdentifier
        );
    });
};

export const buildMetadataFromGraph = (
    graph: graphlib.Graph
): IViewMetadata => {
    return {
        elements: Object.fromEntries(
            graph.nodes().map((nodeId) => {
                const node = graph.node(nodeId) ?? graph.children(nodeId);
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
    };
};

export const autolayoutDiagram = (diagram: Diagram, viewType: ViewType) => {
    return autolayout(diagram, viewType);
};
