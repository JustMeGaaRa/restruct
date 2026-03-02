import {
    IComponentDiagram,
    IContainerDiagram,
    IDeploymentDiagram,
    IDeploymentNode,
    IElement,
    IModelDiagram,
    IRelationship,
    ISystemContextDiagram,
    ISystemLandscapeDiagram,
    ViewType,
} from "@structurizr/dsl";
import { Diagram } from "../types";
import { dagreeGraph } from "./dagree";
import { cytoscapeGraph } from "./cytoscape";
import { IViewMetadata } from "../containers";
import { GraphAdapter } from "./graph";

const defaultPosition = { x: 0, y: 0 };
const defaultSize = { height: 200, width: 200 };

function buildGraphFromSystemLandscapeDiagram(
    diagram: ISystemLandscapeDiagram,
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    [diagram.scope].map((scope) => {
        scope.groups.flatMap((group) => {
            graph.setNode(group.identifier, {
                id: group.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
            group.people.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
            group.softwareSystems.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.softwareSystems.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
        });

        scope.people.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function buildGraphFromSystemContextDiagram(
    diagram: ISystemContextDiagram,
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            id: scope.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            id: element.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function buildGraphFromContainerDiagram(
    diagram: IContainerDiagram,
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            id: scope.identifier,
            ...defaultSize,
            ...defaultPosition,
        });

        scope.groups.flatMap((group) => {
            graph.setNode(group.identifier, {
                id: group.identifier,
                parent: scope.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
            group.containers.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.containers.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                parent: scope.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
            graph.setParent(element.identifier, scope.identifier);
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            id: element.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function buildGraphFromComponentDiagram(
    diagram: IComponentDiagram,
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            id: scope.identifier,
            parent: scope.identifier,
            ...defaultSize,
            ...defaultPosition,
        });

        scope.groups.flatMap((group) => {
            graph.setNode(group.identifier, {
                id: group.identifier,
                parent: scope.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
            group.components.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...defaultSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.components.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                parent: scope.identifier,
                ...defaultSize,
                ...defaultPosition,
            });
            graph.setParent(element.identifier, scope.identifier);
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            id: element.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graph.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function buildGraphFromDeploymentDiagram(
    diagram: IDeploymentDiagram,
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    // TODO(deployment): consider adding the environment as the parent node
    diagram.scope.deploymentNodes.map((node) => {
        buildGraphFromDeploymentNode(graphAdapter, node);
    });

    // TODO(deployment): evaluate the need to process supporting elements here
    diagram.relationships.map((relationship) => {
        graphAdapter.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function buildGraphFromDeploymentNode(
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    deploymentNode: IDeploymentNode
) {
    graphAdapter.setNode(deploymentNode.identifier, {
        id: deploymentNode.identifier,
        ...defaultSize,
        ...defaultPosition,
    });

    deploymentNode.softwareSystemInstances.map((instance) => {
        graphAdapter.setNode(instance.identifier, {
            id: instance.identifier,
            parent: deploymentNode.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
        graphAdapter.setParent(instance.identifier, deploymentNode.identifier);
    });

    deploymentNode.containerInstances.map((instance) => {
        graphAdapter.setNode(instance.identifier, {
            id: instance.identifier,
            parent: deploymentNode.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
        graphAdapter.setParent(instance.identifier, deploymentNode.identifier);
    });

    deploymentNode.infrastructureNodes.map((node) => {
        graphAdapter.setNode(node.identifier, {
            id: node.identifier,
            parent: node.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
        graphAdapter.setParent(node.identifier, deploymentNode.identifier);
    });

    deploymentNode.deploymentNodes.flatMap((node) => {
        buildGraphFromDeploymentNode(graphAdapter, node);
        graphAdapter.setParent(node.identifier, deploymentNode.identifier);
    });
}

function buildGraphFromModelDiagram(
    diagram: IModelDiagram,
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    diagram.supportingElements.map((scope) => {
        graphAdapter.setNode(scope.identifier, {
            id: scope.identifier,
            ...defaultSize,
            ...defaultPosition,
        });
    });

    diagram.relationships.map((relationship) => {
        graphAdapter.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function createDiagramGraph(
    viewType: ViewType,
    diagram: Diagram,
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>
) {
    if (viewType === ViewType.SystemLandscape) {
        buildGraphFromSystemLandscapeDiagram(
            diagram as ISystemLandscapeDiagram,
            graphAdapter
        );
    } else if (viewType === ViewType.SystemContext) {
        buildGraphFromSystemContextDiagram(
            diagram as ISystemContextDiagram,
            graphAdapter
        );
    } else if (viewType === ViewType.Container) {
        buildGraphFromContainerDiagram(
            diagram as IContainerDiagram,
            graphAdapter
        );
    } else if (viewType === ViewType.Component) {
        buildGraphFromComponentDiagram(
            diagram as IComponentDiagram,
            graphAdapter
        );
    } else if (viewType === ViewType.Deployment) {
        buildGraphFromDeploymentDiagram(
            diagram as IDeploymentDiagram,
            graphAdapter
        );
    } else if (viewType === ViewType.Model) {
        buildGraphFromModelDiagram(diagram as IModelDiagram, graphAdapter);
    }

    return graphAdapter;
}

function createLayoutAlgorithm(
    algorithm: "cose" | "layered"
): GraphAdapter<IElement, IRelationship> {
    switch (algorithm) {
        case "cose":
            return cytoscapeGraph();
        case "layered":
            return dagreeGraph();
    }
}

export const autolayoutDiagram = (
    diagram: Diagram,
    viewType: ViewType,
    algorithm: "cose" | "layered" = "layered"
): Promise<IViewMetadata> => {
    return createDiagramGraph(
        viewType,
        diagram,
        createLayoutAlgorithm(algorithm)
    ).layout();
};
