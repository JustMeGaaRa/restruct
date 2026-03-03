import {
    IModel,
    IPerson,
    IRelationship,
    ISoftwareSystem,
    ISystemContextView,
} from "../../interfaces";
import { IDiagramVisitor, ISupportDiagramVisitor } from "../../shared";
import {
    anyRelationshipEquals,
    createWorkspaceExplorer,
    isElementExplicitlyIncludedInView,
    isRelationshipInView,
} from "../../utils";

export class SystemContextViewStrategy
    implements
        ISupportDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson>
{
    constructor(
        private model: IModel,
        private view: ISystemContextView
    ) {}

    accept(
        visitor: IDiagramVisitor<ISoftwareSystem, ISoftwareSystem | IPerson>
    ): void {
        const {
            getWorkspacePeople,
            getWorkspaceSoftwareSystems,
            getImpliedRelationships,
        } = createWorkspaceExplorer(this.model);
        const visitedElements = new Set<string>();
        const relationships = getImpliedRelationships(this.view);
        const people = getWorkspacePeople();
        const softwareSystems = getWorkspaceSoftwareSystems();

        const visitConnectedSoftwareSystems = (
            softwareSystem: ISoftwareSystem
        ) => {
            softwareSystems
                .filter(
                    (otherSoftwareSystem) =>
                        otherSoftwareSystem.identifier !==
                        this.view.softwareSystemIdentifier
                )
                .filter(
                    (otherSoftwareSystem) =>
                        anyRelationshipEquals(
                            relationships,
                            softwareSystem.identifier,
                            otherSoftwareSystem.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            otherSoftwareSystem.identifier
                        )
                )
                .forEach((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    visitor.visitSupportingElement?.(softwareSystem);
                });
        };

        const visitConnectedPeople = (softwareSystem: ISoftwareSystem) => {
            people
                .filter(
                    (person) =>
                        anyRelationshipEquals(
                            relationships,
                            softwareSystem.identifier,
                            person.identifier
                        ) ||
                        isElementExplicitlyIncludedInView(
                            this.view,
                            person.identifier
                        )
                )
                .filter((person) => !visitedElements.has(person.identifier))
                .forEach((person) => {
                    visitedElements.add(person.identifier);
                    visitor.visitSupportingElement?.(person);
                });
        };

        const visitSoftwareSystemInScope = () => {
            softwareSystems
                .filter(
                    (softwareSystem) =>
                        softwareSystem.identifier ===
                        this.view.softwareSystemIdentifier
                )
                .forEach((softwareSystem) => {
                    visitedElements.add(softwareSystem.identifier);
                    visitor.visitScopeElement?.(softwareSystem);

                    visitConnectedPeople(softwareSystem);
                    visitConnectedSoftwareSystems(softwareSystem);
                });
        };

        const visitRelationshipArray = (
            relationships: Array<IRelationship>
        ) => {
            relationships
                .filter((relationship) =>
                    isRelationshipInView(visitedElements, relationship)
                )
                .forEach((relationship) =>
                    visitor.visitRelationship?.(relationship)
                );
        };

        visitSoftwareSystemInScope();
        visitRelationshipArray(relationships);
    }
}
