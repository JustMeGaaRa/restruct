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
} from "@restruct/structurizr-dsl";
import {
    Diagram,
    ELEMENT_DEFAULT_HEIGHT,
    ELEMENT_DEFAULT_WIDTH,
} from "../types";
import { dagreeGraph } from "./dagree";
import { IViewMetadata } from "../containers";
import { GraphAdapter } from "./graph";

const defaultPosition = { x: 0, y: 0 };

type AutolayoutOptions = {
    nodeSize: { width: number; height: number };
    padding: number;
};

function buildGraphFromSystemLandscapeDiagram(
    diagram: ISystemLandscapeDiagram,
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    [diagram.scope].map((scope) => {
        scope.groups.flatMap((group) => {
            graph.setNode(group.identifier, {
                id: group.identifier,
                ...options.nodeSize,
                ...defaultPosition,
            });
            group.people.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...options.nodeSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
            group.softwareSystems.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...options.nodeSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.softwareSystems.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                ...options.nodeSize,
                ...defaultPosition,
            });
        });

        scope.people.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                ...options.nodeSize,
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
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            id: scope.identifier,
            ...options.nodeSize,
            ...defaultPosition,
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            id: element.identifier,
            ...options.nodeSize,
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
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            id: scope.identifier,
            ...options.nodeSize,
            ...defaultPosition,
        });

        scope.groups.flatMap((group) => {
            graph.setNode(group.identifier, {
                id: group.identifier,
                parent: scope.identifier,
                ...options.nodeSize,
                ...defaultPosition,
            });
            group.containers.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...options.nodeSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.containers.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                parent: scope.identifier,
                ...options.nodeSize,
                ...defaultPosition,
            });
            graph.setParent(element.identifier, scope.identifier);
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            id: element.identifier,
            ...options.nodeSize,
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
    graph: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    [diagram.scope].map((scope) => {
        graph.setNode(scope.identifier, {
            id: scope.identifier,
            parent: scope.identifier,
            ...options.nodeSize,
            ...defaultPosition,
        });

        scope.groups.flatMap((group) => {
            graph.setNode(group.identifier, {
                id: group.identifier,
                parent: scope.identifier,
                ...options.nodeSize,
                ...defaultPosition,
            });
            group.components.map((element) => {
                graph.setNode(element.identifier, {
                    id: element.identifier,
                    parent: group.identifier,
                    ...options.nodeSize,
                    ...defaultPosition,
                });
                graph.setParent(element.identifier, group.identifier);
            });
        });

        scope.components.map((element) => {
            graph.setNode(element.identifier, {
                id: element.identifier,
                parent: scope.identifier,
                ...options.nodeSize,
                ...defaultPosition,
            });
            graph.setParent(element.identifier, scope.identifier);
        });
    });

    diagram.supportingElements.map((element) => {
        graph.setNode(element.identifier, {
            id: element.identifier,
            ...options.nodeSize,
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
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    diagram.scope.deploymentNodes.forEach((node) => {
        buildGraphFromDeploymentNode(graphAdapter, node, options);
    });

    diagram.relationships.forEach((relationship) => {
        graphAdapter.setEdge(relationship.identifier, {
            id: relationship.identifier,
            source: relationship.sourceIdentifier,
            target: relationship.targetIdentifier,
        });
    });
}

function buildGraphFromDeploymentNode(
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    deploymentNode: IDeploymentNode,
    options: AutolayoutOptions
) {
    graphAdapter.setNode(deploymentNode.identifier, {
        id: deploymentNode.identifier,
        ...options.nodeSize,
        ...defaultPosition,
    });

    deploymentNode.softwareSystemInstances.forEach((instance) => {
        graphAdapter.setNode(instance.identifier, {
            id: instance.identifier,
            parent: deploymentNode.identifier,
            ...options.nodeSize,
            ...defaultPosition,
        });
        graphAdapter.setParent(instance.identifier, deploymentNode.identifier);
    });

    deploymentNode.containerInstances.forEach((instance) => {
        graphAdapter.setNode(instance.identifier, {
            id: instance.identifier,
            parent: deploymentNode.identifier,
            ...options.nodeSize,
            ...defaultPosition,
        });
        graphAdapter.setParent(instance.identifier, deploymentNode.identifier);
    });

    deploymentNode.infrastructureNodes.forEach((node) => {
        graphAdapter.setNode(node.identifier, {
            id: node.identifier,
            parent: deploymentNode.identifier,
            ...options.nodeSize,
            ...defaultPosition,
        });
        graphAdapter.setParent(node.identifier, deploymentNode.identifier);
    });

    deploymentNode.deploymentNodes.forEach((node) => {
        buildGraphFromDeploymentNode(graphAdapter, node, options);
        graphAdapter.setParent(node.identifier, deploymentNode.identifier);
    });
}

function buildGraphFromModelDiagram(
    diagram: IModelDiagram,
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    diagram.supportingElements.map((scope) => {
        graphAdapter.setNode(scope.identifier, {
            id: scope.identifier,
            ...options.nodeSize,
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
    graphAdapter: GraphAdapter<IElement, IRelationship, IViewMetadata>,
    options: AutolayoutOptions
) {
    if (viewType === ViewType.SystemLandscape) {
        buildGraphFromSystemLandscapeDiagram(
            diagram as ISystemLandscapeDiagram,
            graphAdapter,
            options
        );
    } else if (viewType === ViewType.SystemContext) {
        buildGraphFromSystemContextDiagram(
            diagram as ISystemContextDiagram,
            graphAdapter,
            options
        );
    } else if (viewType === ViewType.Container) {
        buildGraphFromContainerDiagram(
            diagram as IContainerDiagram,
            graphAdapter,
            options
        );
    } else if (viewType === ViewType.Component) {
        buildGraphFromComponentDiagram(
            diagram as IComponentDiagram,
            graphAdapter,
            options
        );
    } else if (viewType === ViewType.Deployment) {
        buildGraphFromDeploymentDiagram(
            diagram as IDeploymentDiagram,
            graphAdapter,
            options
        );
    } else if (viewType === ViewType.Model) {
        buildGraphFromModelDiagram(
            diagram as IModelDiagram,
            graphAdapter,
            options
        );
    }

    return graphAdapter;
}

import { elkjsGraph } from "./elkjs";

function createLayoutAlgorithm(
    algorithm: "layered" | "elkjs"
): GraphAdapter<IElement, IRelationship> {
    switch (algorithm) {
        case "layered":
            return dagreeGraph();
        case "elkjs":
            return elkjsGraph();
    }
}

export const autolayoutDiagram = (
    diagram: Diagram,
    viewType: ViewType,
    algorithm: "layered" | "elkjs" = "elkjs",
    options?: Partial<AutolayoutOptions>
): Promise<IViewMetadata> => {
    const defaultSize = {
        width: ELEMENT_DEFAULT_WIDTH,
        height: ELEMENT_DEFAULT_HEIGHT,
    };
    const finalOptions = {
        nodeSize: options?.nodeSize ?? defaultSize,
        padding: options?.padding ?? 100,
    };
    const layoutAlgorithm = createLayoutAlgorithm(algorithm);
    return createDiagramGraph(
        viewType,
        diagram,
        layoutAlgorithm,
        finalOptions
    ).layout();
};
