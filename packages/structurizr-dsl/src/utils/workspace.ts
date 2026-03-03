import {
    IComponent,
    IContainer,
    IContainerView,
    IDeploymentNode,
    IDeploymentView,
    IElement,
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextView,
    ISystemLandscapeView,
    ViewType,
} from "../interfaces";
import { IElementVisitor } from "../shared";
import {
    createRelationship,
    filterRelationshipsBetweenElements,
} from "./relationship";

export const traverseWorkspace = (model: IModel, visitor: IElementVisitor) => {
    const visitComponent = (component: IComponent, parentId?: string) => {
        visitor.visitComponent?.(component, { parentId });
        component.relationships.forEach((relationship) => {
            visitor.visitRelationship?.(relationship);
        });
    };

    const visitContainer = (container: IContainer, parentId?: string) => {
        visitor.visitContainer?.(container, { parentId });
        container.components.forEach((component) =>
            visitComponent(component, container.identifier)
        );
        container.groups.forEach((group) => {
            visitor.visitGroup?.(group, { parentId: container.identifier });
            group.components.forEach((component) =>
                visitComponent(component, group.identifier)
            );
        });
        container.relationships.forEach((relationship) => {
            visitor.visitRelationship?.(relationship);
        });
    };

    const visitSoftwareSystem = (
        softwareSystem: ISoftwareSystem,
        parentId?: string
    ) => {
        visitor.visitSoftwareSystem?.(softwareSystem, { parentId });
        softwareSystem.containers.forEach((container) =>
            visitContainer(container, softwareSystem.identifier)
        );
        softwareSystem.groups.forEach((group) => {
            visitor.visitGroup?.(group, {
                parentId: softwareSystem.identifier,
            });
            group.containers.forEach((container) =>
                visitContainer(container, group.identifier)
            );
        });
        softwareSystem.relationships.forEach((relationship) => {
            visitor.visitRelationship?.(relationship);
        });
    };

    const visitDeploymentNode = (node: IDeploymentNode, parentId?: string) => {
        visitor.visitDeploymentNode?.(node, { parentId });

        node.relationships.forEach((relationship) => {
            visitor.visitRelationship?.(relationship);
        });

        node.containerInstances.forEach((instance) => {
            visitor.visitContainerInstance?.(instance, {
                parentId: node.identifier,
            });
            instance.relationships?.forEach((relationship) => {
                visitor.visitRelationship?.(relationship);
            });
        });

        node.softwareSystemInstances.forEach((instance) => {
            visitor.visitSoftwareSystemInstance?.(instance, {
                parentId: node.identifier,
            });
            instance.relationships?.forEach((relationship) => {
                visitor.visitRelationship?.(relationship);
            });
        });

        node.infrastructureNodes.forEach((instance) => {
            visitor.visitInfrastructureNode?.(instance, {
                parentId: node.identifier,
            });
            instance.relationships?.forEach((relationship) => {
                visitor.visitRelationship?.(relationship);
            });
        });

        node.deploymentNodes.forEach((subnode) =>
            visitDeploymentNode(subnode, node.identifier)
        );
    };

    model.people.forEach((person) => visitor.visitPerson?.(person));
    model.softwareSystems.forEach((softwareSystem) =>
        visitSoftwareSystem(softwareSystem)
    );
    model.groups.forEach((group) => {
        visitor.visitGroup?.(group);
        group.people.forEach((person) =>
            visitor.visitPerson?.(person, { parentId: group.identifier })
        );
        group.softwareSystems.forEach((softwareSystem) =>
            visitSoftwareSystem(softwareSystem, group.identifier)
        );
    });
    model.deploymentEnvironments.forEach((deploymentEnvironment) => {
        deploymentEnvironment.deploymentNodes.forEach((node) =>
            visitDeploymentNode(node)
        );
    });
    model.relationships.forEach((relationship) =>
        visitor.visitRelationship?.(relationship)
    );
};

export const createWorkspaceExplorer = (model: IModel) => {
    const workspacePeople: Map<string, IPerson> = new Map();
    const workspaceSoftwareSystems: Map<string, ISoftwareSystem> = new Map();
    const workspaceContainers: Map<string, IContainer> = new Map();
    const workspaceComponents: Map<string, IComponent> = new Map();
    const workspaceRelationships: Map<string, IRelationship> = new Map();
    const workspaceElements: Map<string, IElement> = new Map();
    const elementParentMap = new Map<string, string | undefined>();

    traverseWorkspace(model, {
        visitPerson: (person, param) => {
            workspacePeople.set(person.identifier, person);
            workspaceElements.set(person.identifier, person);
            elementParentMap.set(person.identifier, param?.parentId);
        },
        visitSoftwareSystem: (softwareSystem, param) => {
            workspaceSoftwareSystems.set(
                softwareSystem.identifier,
                softwareSystem
            );
            workspaceElements.set(softwareSystem.identifier, softwareSystem);
            elementParentMap.set(softwareSystem.identifier, param?.parentId);
        },
        visitContainer: (container, param) => {
            workspaceContainers.set(container.identifier, container);
            workspaceElements.set(container.identifier, container);
            elementParentMap.set(container.identifier, param?.parentId);
        },
        visitComponent: (component, param) => {
            workspaceComponents.set(component.identifier, component);
            workspaceElements.set(component.identifier, component);
            elementParentMap.set(component.identifier, param?.parentId);
        },
        visitRelationship: (relationship) => {
            workspaceRelationships.set(relationship.identifier, relationship);
        },
    });

    const getWorkspacePeople = () => {
        return Array.from(workspacePeople.values());
    };

    const getPersonById = (identifier: string) => {
        return workspacePeople.get(identifier);
    };

    const getWorkspaceSoftwareSystems = () => {
        return Array.from(workspaceSoftwareSystems.values());
    };

    const getSoftwareSystemById = (identifier: string) => {
        return workspaceSoftwareSystems.get(identifier);
    };

    const getWorkspaceContainers = () => {
        return Array.from(workspaceContainers.values());
    };

    const getContainerById = (identifier: string) => {
        return workspaceContainers.get(identifier);
    };

    const getWorkspaceComponents = () => {
        return Array.from(workspaceComponents.values());
    };

    const getComponentById = (identifier: string) => {
        return workspaceComponents.get(identifier);
    };

    const getWorkspaceRelationships = (): Array<IRelationship> => {
        return Array.from(workspaceRelationships.values());
    };

    const getImpliedRelationships = (
        view?:
            | ISystemLandscapeView
            | ISystemContextView
            | IContainerView
            | IDeploymentView
    ) => {
        const relationships = getWorkspaceRelationships();
        const people = getWorkspacePeople();
        const softwareSystems = getWorkspaceSoftwareSystems();

        const isSystemLandscapeView = view?.type === ViewType.SystemLandscape;
        const isSystemContextView = view?.type === ViewType.SystemContext;
        const isContainerView = view?.type === ViewType.Container;
        const isDeploymentView = view?.type === ViewType.Deployment;

        const impliedRelationships = workspaceRelationships;

        const setImpliedRelationshipIfNotExist = (
            elementIdentifier: string,
            elementParentIdentifier: string,
            originalRelationship: IRelationship
        ) => {
            const isElementSource =
                originalRelationship.sourceIdentifier === elementIdentifier;
            const sourceIdentifier = isElementSource
                ? elementParentIdentifier
                : originalRelationship.sourceIdentifier;
            const targetIdentifier = isElementSource
                ? originalRelationship.targetIdentifier
                : elementParentIdentifier;

            const impliedRelationship = createRelationship(
                sourceIdentifier,
                targetIdentifier,
                originalRelationship.description
            );

            if (!impliedRelationships.has(impliedRelationship.identifier)) {
                impliedRelationships.set(
                    impliedRelationship.identifier,
                    impliedRelationship
                );
            }
        };

        // RESTRICTION: System Landscape and System Context views only allow realtionships from:
        // - Software System --> Person
        // - Software System <-- Person
        // - Software System --> Software System
        // RESTRICTION: Container View only allows realtionships from:
        // - Container --> Person | Software System
        // - Container <-- Person | Software System
        // - Container --> Container (in the same scope)
        const softwareSystemsInScope =
            isSystemContextView || isContainerView
                ? softwareSystems.filter(
                      (x) => x.identifier === view.softwareSystemIdentifier
                  )
                : softwareSystems;

        softwareSystemsInScope.forEach((softwareSystemScope) => {
            // filter out the current software system to avoid self-referencing
            const otherSoftwareSystems = softwareSystems.filter(
                (x) => x.identifier !== softwareSystemScope.identifier
            );
            const externalSystemsOrPeople = [
                ...otherSoftwareSystems,
                ...people,
            ];

            const childContainers = softwareSystemScope.groups
                .flatMap((group) => group.containers)
                .concat(softwareSystemScope.containers);

            childContainers.forEach((container) => {
                const childComponents = container.groups
                    .flatMap((group) => group.components)
                    .concat(container.components);

                childComponents.forEach((component) => {
                    // CASE: Check if any Components have explicit relationship with any Software System or Person
                    // and create an implied relationship from this Container to the Software System or Person
                    filterRelationshipsBetweenElements(
                        relationships,
                        component,
                        externalSystemsOrPeople
                    ).forEach((relationship) => {
                        const parentElementId =
                            isContainerView || isDeploymentView
                                ? container.identifier
                                : softwareSystemScope.identifier;
                        setImpliedRelationshipIfNotExist(
                            component.identifier,
                            parentElementId,
                            relationship
                        );
                    });

                    if (isContainerView || isDeploymentView) {
                        const otherScopeContainers = childContainers.filter(
                            (x) => x.identifier !== container.identifier
                        );
                        // CASE: Check if any Components have explicit relationship with other Containers in the scope
                        // and create an implied relationship from this Container to the other Container
                        filterRelationshipsBetweenElements(
                            relationships,
                            component,
                            otherScopeContainers
                        ).forEach((relationship) => {
                            setImpliedRelationshipIfNotExist(
                                component.identifier,
                                container.identifier,
                                relationship
                            );
                        });
                    }
                });

                if (isSystemLandscapeView || isSystemContextView) {
                    // CASE: Check if any Containers have explicit relationship with any Software System or Person
                    // and create an implied relationship from this Software System to the Software System or Person
                    filterRelationshipsBetweenElements(
                        relationships,
                        container,
                        externalSystemsOrPeople
                    ).forEach((relationship) => {
                        setImpliedRelationshipIfNotExist(
                            container.identifier,
                            softwareSystemScope.identifier,
                            relationship
                        );
                    });
                }
            });
        });

        return Array.from(impliedRelationships.values());
    };

    return {
        getWorkspacePeople,
        getPersonById,
        getWorkspaceSoftwareSystems,
        getSoftwareSystemById,
        getWorkspaceContainers,
        getContainerById,
        getWorkspaceComponents,
        getComponentById,
        getWorkspaceRelationships,
        getImpliedRelationships,
    };
};
