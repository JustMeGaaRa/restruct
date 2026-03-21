import { IAutoLayout } from "../../interfaces/IAutoLayout";
import { IComponent } from "../../interfaces/IComponent";
import { IContainer } from "../../interfaces/IContainer";
import { IContainerInstance } from "../../interfaces/IContainerInstance";
import { IDeploymentEnvironment } from "../../interfaces/IDeploymentEnvironment";
import { IDeploymentNode } from "../../interfaces/IDeploymentNode";
import { IGroup } from "../../interfaces/IGroup";
import { IInfrastructureNode } from "../../interfaces/IInfrastructureNode";
import { IModel } from "../../interfaces/IModel";
import { IPerson } from "../../interfaces/IPerson";
import { IRelationship } from "../../interfaces/IRelationship";
import { ISoftwareSystem } from "../../interfaces/ISoftwareSystem";
import { ISoftwareSystemInstance } from "../../interfaces/ISoftwareSystemInstance";
import { IViews } from "../../interfaces/IViews";
import { IWorkspace } from "../../interfaces/IWorkspace";
import { Tag } from "../../models/Tag";
import { StructurizrDslWriter } from "./StructurizrDslWriter";
import { IdentifierRegistry } from "./IdentifierRegistry";

const DEFAULT_TAGS = new Set<string>([
    Tag.Workspace.name,
    Tag.Element.name,
    Tag.Group.name,
    Tag.Person.name,
    Tag.SoftwareSystem.name,
    Tag.Container.name,
    Tag.Component.name,
    Tag.DeploymentNode.name,
    Tag.InfrastructureNode.name,
    Tag.SoftwareSystemInstance.name,
    Tag.ContainerInstance.name,
    Tag.Relationship.name,
]);

/**
 * Exports an IWorkspace to Structurizr DSL format.
 *
 * Uses the Visitor pattern: each element type has a dedicated `write*`
 * method that acts as a visitor for that node in the element tree.
 * The exporter performs two passes before writing:
 *
 *   1. Collect all path identifiers that appear in relationships or views.
 *   2. Register DSL identifiers (camelCase names) only for referenced elements.
 *
 * Relationships are written inline at the same level where they are defined
 * in the workspace model.
 */
export class WorkspaceDslExporter {
    private writer!: StructurizrDslWriter;
    private registry!: IdentifierRegistry;
    private referenced!: Set<string>;

    export(workspace: IWorkspace): string {
        this.writer = new StructurizrDslWriter();
        this.registry = new IdentifierRegistry();
        this.referenced = new Set<string>();

        this.collectReferencedIds(workspace);
        this.registerIds(workspace);
        this.writeWorkspace(workspace);

        return this.writer.toString();
    }

    // -------------------------------------------------------------------------
    // Pass 1: collect all path identifiers referenced in relationships / views
    // -------------------------------------------------------------------------

    private collectReferencedIds(workspace: IWorkspace): void {
        const { model, views } = workspace;

        this.collectRelationships(model.relationships);

        for (const person of model.people) {
            this.collectRelationships(person.relationships);
        }

        for (const group of model.groups) {
            for (const person of group.people) {
                this.collectRelationships(person.relationships);
            }
            for (const ss of group.softwareSystems) {
                this.collectSoftwareSystemRelationships(ss);
            }
        }

        for (const ss of model.softwareSystems) {
            this.collectSoftwareSystemRelationships(ss);
        }

        for (const env of model.deploymentEnvironments) {
            this.collectRelationships(env.relationships);
            this.collectDeploymentNodeRelationships(env.deploymentNodes);
        }

        // Views reference specific elements by their path identifiers
        for (const view of views.systemContexts) {
            this.referenced.add(view.softwareSystemIdentifier);
        }
        for (const view of views.containers) {
            this.referenced.add(view.softwareSystemIdentifier);
        }
        for (const view of views.components) {
            this.referenced.add(view.containerIdentifier);
        }
        for (const view of views.deployments) {
            this.referenced.add(view.softwareSystemIdentifier);
        }
    }

    private collectRelationships(relationships: IRelationship[]): void {
        for (const rel of relationships) {
            this.referenced.add(rel.sourceIdentifier);
            this.referenced.add(rel.targetIdentifier);
        }
    }

    private collectSoftwareSystemRelationships(ss: ISoftwareSystem): void {
        this.collectRelationships(ss.relationships);
        for (const container of ss.containers) {
            this.collectRelationships(container.relationships);
            for (const component of container.components) {
                this.collectRelationships(component.relationships);
            }
        }
    }

    private collectDeploymentNodeRelationships(nodes: IDeploymentNode[]): void {
        for (const node of nodes) {
            this.collectRelationships(node.relationships);
            // Container/SoftwareSystem instances reference their originals by path id
            for (const ci of node.containerInstances) {
                this.referenced.add(ci.containerIdentifier);
            }
            for (const ssi of node.softwareSystemInstances) {
                this.referenced.add(ssi.softwareSystemIdentifier);
            }
            this.collectDeploymentNodeRelationships(node.deploymentNodes);
        }
    }

    // -------------------------------------------------------------------------
    // Pass 2: register DSL identifiers for all referenced elements
    // -------------------------------------------------------------------------

    private registerIds(workspace: IWorkspace): void {
        const { model } = workspace;

        for (const person of model.people) {
            this.registerIfReferenced(person.identifier, person.name);
        }

        for (const group of model.groups) {
            for (const person of group.people) {
                this.registerIfReferenced(person.identifier, person.name);
            }
            for (const ss of group.softwareSystems) {
                this.registerSoftwareSystemIds(ss);
            }
        }

        for (const ss of model.softwareSystems) {
            this.registerSoftwareSystemIds(ss);
        }

        for (const env of model.deploymentEnvironments) {
            this.registerDeploymentNodeIds(env.deploymentNodes);
        }
    }

    private registerSoftwareSystemIds(ss: ISoftwareSystem): void {
        this.registerIfReferenced(ss.identifier, ss.name);
        for (const container of ss.containers) {
            this.registerIfReferenced(container.identifier, container.name);
            for (const component of container.components) {
                this.registerIfReferenced(component.identifier, component.name);
            }
        }
    }

    private registerDeploymentNodeIds(nodes: IDeploymentNode[]): void {
        for (const node of nodes) {
            this.registerIfReferenced(node.identifier, node.name);
            for (const infra of node.infrastructureNodes) {
                this.registerIfReferenced(infra.identifier, infra.name);
            }
            this.registerDeploymentNodeIds(node.deploymentNodes);
        }
    }

    private registerIfReferenced(pathId: string, name: string): void {
        if (this.referenced.has(pathId)) {
            this.registry.register(pathId, name);
        }
    }

    // -------------------------------------------------------------------------
    // Pass 3: write DSL (visitor dispatch per element type)
    // -------------------------------------------------------------------------

    private writeWorkspace(workspace: IWorkspace): void {
        const parts: string[] = ["workspace"];
        if (workspace.name) parts.push(`"${workspace.name}"`);
        if (workspace.description) parts.push(`"${workspace.description}"`);

        this.writer.openBlock(parts.join(" "));
        this.writer.writeLine("");
        this.writeModel(workspace.model);
        this.writer.writeLine("");
        this.writeViews(workspace.views);
        this.writer.writeLine("");
        this.writer.closeBlock();
    }

    // ── Model ─────────────────────────────────────────────────────────────────

    private writeModel(model: IModel): void {
        this.writer.openBlock("model");

        for (const group of model.groups) {
            this.writer.writeLine("");
            this.writeGroup(group);
        }

        for (const person of model.people) {
            this.writer.writeLine("");
            this.writePerson(person);
        }

        for (const ss of model.softwareSystems) {
            this.writer.writeLine("");
            this.writeSoftwareSystem(ss);
        }

        for (const env of model.deploymentEnvironments) {
            this.writer.writeLine("");
            this.writeDeploymentEnvironment(env);
        }

        if (model.relationships.length > 0) {
            this.writer.writeLine("");
            this.writeRelationships(model.relationships);
        }

        this.writer.writeLine("");
        this.writer.closeBlock();
    }

    // ── Group ─────────────────────────────────────────────────────────────────

    private writeGroup(group: IGroup): void {
        this.writer.openBlock(`group "${group.name}"`);

        for (const person of group.people) {
            this.writer.writeLine("");
            this.writePerson(person);
        }

        for (const ss of group.softwareSystems) {
            this.writer.writeLine("");
            this.writeSoftwareSystem(ss);
        }

        for (const container of group.containers) {
            this.writer.writeLine("");
            this.writeContainer(container);
        }

        for (const component of group.components) {
            this.writer.writeLine("");
            this.writeComponent(component);
        }

        this.writer.writeLine("");
        this.writer.closeBlock();
    }

    // ── Person ────────────────────────────────────────────────────────────────

    private writePerson(person: IPerson): void {
        const idPrefix = this.resolveIdPrefix(person.identifier);
        const tags = this.filterTags(person.tags.map((t) => t.name));
        const hasBlock = person.relationships.length > 0 || tags.length > 0;

        const header = [
            idPrefix,
            "person",
            `"${person.name}"`,
            person.description ? `"${person.description}"` : null,
        ]
            .filter(Boolean)
            .join(" ");

        if (hasBlock) {
            this.writer.openBlock(header);
            if (tags.length > 0) this.writeTagsLine(tags);
            if (person.relationships.length > 0) {
                this.writeRelationships(person.relationships);
            }
            this.writer.closeBlock();
        } else {
            this.writer.writeLine(header);
        }
    }

    // ── SoftwareSystem ────────────────────────────────────────────────────────

    private writeSoftwareSystem(ss: ISoftwareSystem): void {
        const idPrefix = this.resolveIdPrefix(ss.identifier);
        const tags = this.filterTags(ss.tags.map((t) => t.name));
        const hasBlock =
            ss.groups.length > 0 ||
            ss.containers.length > 0 ||
            ss.relationships.length > 0 ||
            tags.length > 0;

        const header = [
            idPrefix,
            "softwareSystem",
            `"${ss.name}"`,
            ss.description ? `"${ss.description}"` : null,
        ]
            .filter(Boolean)
            .join(" ");

        if (hasBlock) {
            this.writer.openBlock(header);

            for (const group of ss.groups) {
                this.writer.writeLine("");
                this.writeGroup(group);
            }

            for (const container of ss.containers) {
                this.writer.writeLine("");
                this.writeContainer(container);
            }

            if (tags.length > 0) this.writeTagsLine(tags);

            if (ss.relationships.length > 0) {
                this.writeRelationships(ss.relationships);
            }

            this.writer.writeLine("");
            this.writer.closeBlock();
        } else {
            this.writer.writeLine(header);
        }
    }

    // ── Container ─────────────────────────────────────────────────────────────

    private writeContainer(container: IContainer): void {
        const idPrefix = this.resolveIdPrefix(container.identifier);
        const tech =
            container.technology.length > 0
                ? `"${container.technology.join(", ")}"`
                : null;
        const tags = this.filterTags(container.tags.map((t) => t.name));
        const hasBlock =
            container.groups.length > 0 ||
            container.components.length > 0 ||
            container.relationships.length > 0 ||
            tags.length > 0;

        const header = [
            idPrefix,
            "container",
            `"${container.name}"`,
            container.description ? `"${container.description}"` : null,
            tech,
        ]
            .filter(Boolean)
            .join(" ");

        if (hasBlock) {
            this.writer.openBlock(header);

            for (const group of container.groups) {
                this.writer.writeLine("");
                this.writeGroup(group);
            }

            for (const component of container.components) {
                this.writer.writeLine("");
                this.writeComponent(component);
            }

            if (tags.length > 0) this.writeTagsLine(tags);

            if (container.relationships.length > 0) {
                this.writeRelationships(container.relationships);
            }

            this.writer.writeLine("");
            this.writer.closeBlock();
        } else {
            this.writer.writeLine(header);
        }
    }

    // ── Component ─────────────────────────────────────────────────────────────

    private writeComponent(component: IComponent): void {
        const idPrefix = this.resolveIdPrefix(component.identifier);
        const tech =
            component.technology.length > 0
                ? `"${component.technology.join(", ")}"`
                : null;
        const tags = this.filterTags(component.tags.map((t) => t.name));
        const hasBlock = component.relationships.length > 0 || tags.length > 0;

        const header = [
            idPrefix,
            "component",
            `"${component.name}"`,
            component.description ? `"${component.description}"` : null,
            tech,
        ]
            .filter(Boolean)
            .join(" ");

        if (hasBlock) {
            this.writer.openBlock(header);
            if (tags.length > 0) this.writeTagsLine(tags);
            if (component.relationships.length > 0) {
                this.writeRelationships(component.relationships);
            }
            this.writer.closeBlock();
        } else {
            this.writer.writeLine(header);
        }
    }

    // ── Deployment ────────────────────────────────────────────────────────────

    private writeDeploymentEnvironment(env: IDeploymentEnvironment): void {
        this.writer.openBlock(`deploymentEnvironment "${env.name}"`);

        for (const node of env.deploymentNodes) {
            this.writer.writeLine("");
            this.writeDeploymentNode(node);
        }

        if (env.relationships.length > 0) {
            this.writer.writeLine("");
            this.writeRelationships(env.relationships);
        }

        this.writer.writeLine("");
        this.writer.closeBlock();
    }

    private writeDeploymentNode(node: IDeploymentNode): void {
        const idPrefix = this.resolveIdPrefix(node.identifier);
        const tech =
            node.technology.length > 0
                ? `"${node.technology.join(", ")}"`
                : null;
        const tags = this.filterTags(node.tags.map((t) => t.name));

        const header = [
            idPrefix,
            "deploymentNode",
            `"${node.name}"`,
            node.description ? `"${node.description}"` : null,
            tech,
            node.instances !== undefined && node.instances !== 1
                ? `"${node.instances}"`
                : null,
        ]
            .filter(Boolean)
            .join(" ");

        this.writer.openBlock(header);

        for (const child of node.deploymentNodes) {
            this.writer.writeLine("");
            this.writeDeploymentNode(child);
        }

        for (const infra of node.infrastructureNodes) {
            this.writer.writeLine("");
            this.writeInfrastructureNode(infra);
        }

        for (const ssi of node.softwareSystemInstances) {
            this.writer.writeLine("");
            this.writeSoftwareSystemInstance(ssi);
        }

        for (const ci of node.containerInstances) {
            this.writer.writeLine("");
            this.writeContainerInstance(ci);
        }

        if (tags.length > 0) this.writeTagsLine(tags);

        if (node.relationships.length > 0) {
            this.writer.writeLine("");
            this.writeRelationships(node.relationships);
        }

        this.writer.writeLine("");
        this.writer.closeBlock();
    }

    private writeInfrastructureNode(infra: IInfrastructureNode): void {
        const idPrefix = this.resolveIdPrefix(infra.identifier);
        const tech =
            infra.technology && infra.technology.length > 0
                ? `"${infra.technology.join(", ")}"`
                : null;
        const tags = this.filterTags(infra.tags.map((t) => t.name));
        const hasBlock = infra.relationships.length > 0 || tags.length > 0;

        const header = [
            idPrefix,
            "infrastructureNode",
            `"${infra.name}"`,
            infra.description ? `"${infra.description}"` : null,
            tech,
        ]
            .filter(Boolean)
            .join(" ");

        if (hasBlock) {
            this.writer.openBlock(header);
            if (tags.length > 0) this.writeTagsLine(tags);
            if (infra.relationships.length > 0) {
                this.writeRelationships(infra.relationships);
            }
            this.writer.closeBlock();
        } else {
            this.writer.writeLine(header);
        }
    }

    private writeSoftwareSystemInstance(ssi: ISoftwareSystemInstance): void {
        const referencedId = this.registry.resolve(
            ssi.softwareSystemIdentifier
        );
        if (!referencedId) return;
        this.writer.writeLine(`softwareSystemInstance ${referencedId}`);
    }

    private writeContainerInstance(ci: IContainerInstance): void {
        const referencedId = this.registry.resolve(ci.containerIdentifier);
        if (!referencedId) return;
        this.writer.writeLine(`containerInstance ${referencedId}`);
    }

    // ── Views ─────────────────────────────────────────────────────────────────

    private writeViews(views: IViews): void {
        this.writer.openBlock("views");

        if (views.systemLandscape) {
            const v = views.systemLandscape;
            const parts = ["systemLandscape"];
            if (v.key) parts.push(`"${v.key}"`);
            if (v.title) parts.push(`"${v.title}"`);

            this.writer.writeLine("");
            this.writer.openBlock(parts.join(" "));
            if (v.include) this.writeIncludes(v.include);
            if (v.autoLayout) this.writeAutoLayout(v.autoLayout);
            this.writer.closeBlock();
        }

        for (const v of views.systemContexts) {
            const scopeId = this.registry.resolve(v.softwareSystemIdentifier);
            if (!scopeId) continue;

            const parts = ["systemContext", scopeId];
            if (v.key) parts.push(`"${v.key}"`);
            if (v.title) parts.push(`"${v.title}"`);

            this.writer.writeLine("");
            this.writer.openBlock(parts.join(" "));
            if (v.include) this.writeIncludes(v.include);
            if (v.autoLayout) this.writeAutoLayout(v.autoLayout);
            this.writer.closeBlock();
        }

        for (const v of views.containers) {
            const scopeId = this.registry.resolve(v.softwareSystemIdentifier);
            if (!scopeId) continue;

            const parts = ["container", scopeId];
            if (v.key) parts.push(`"${v.key}"`);
            if (v.title) parts.push(`"${v.title}"`);

            this.writer.writeLine("");
            this.writer.openBlock(parts.join(" "));
            if (v.include) this.writeIncludes(v.include);
            if (v.autoLayout) this.writeAutoLayout(v.autoLayout);
            this.writer.closeBlock();
        }

        for (const v of views.components) {
            const scopeId = this.registry.resolve(v.containerIdentifier);
            if (!scopeId) continue;

            const parts = ["component", scopeId];
            if (v.key) parts.push(`"${v.key}"`);
            if (v.title) parts.push(`"${v.title}"`);

            this.writer.writeLine("");
            this.writer.openBlock(parts.join(" "));
            if (v.include) this.writeIncludes(v.include);
            if (v.autoLayout) this.writeAutoLayout(v.autoLayout);
            this.writer.closeBlock();
        }

        for (const v of views.deployments) {
            const scopeId = this.registry.resolve(v.softwareSystemIdentifier);
            if (!scopeId) continue;

            const parts = ["deployment", scopeId, `"${v.environment}"`];
            if (v.key) parts.push(`"${v.key}"`);
            if (v.title) parts.push(`"${v.title}"`);

            this.writer.writeLine("");
            this.writer.openBlock(parts.join(" "));
            if (v.include) this.writeIncludes(v.include);
            if (v.autoLayout) this.writeAutoLayout(v.autoLayout);
            this.writer.closeBlock();
        }

        const { styles, themes } = views.configuration;
        const hasStyles =
            styles.elements.length > 0 || styles.relationships.length > 0;

        if (hasStyles) {
            this.writer.writeLine("");
            this.writer.openBlock("styles");

            for (const style of styles.elements) {
                this.writer.writeLine("");
                this.writer.openBlock(`element "${style.tag}"`);
                this.writeStyleProperties(style, [
                    "background",
                    "color",
                    "stroke",
                    "shape",
                    "border",
                    "fontSize",
                    "opacity",
                    "width",
                    "height",
                    "icon",
                ]);
                this.writer.closeBlock();
            }

            for (const style of styles.relationships) {
                this.writer.writeLine("");
                this.writer.openBlock(`relationship "${style.tag}"`);
                this.writeStyleProperties(style, [
                    "thickness",
                    "color",
                    "style",
                    "routing",
                    "fontSize",
                    "opacity",
                ]);
                this.writer.closeBlock();
            }

            this.writer.writeLine("");
            this.writer.closeBlock();
        }

        for (const theme of themes) {
            this.writer.writeLine("");
            this.writer.writeLine(`theme ${theme}`);
        }

        this.writer.writeLine("");
        this.writer.closeBlock();
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    private writeRelationships(relationships: IRelationship[]): void {
        for (const rel of relationships) {
            const sourceId = this.registry.resolve(rel.sourceIdentifier);
            const targetId = this.registry.resolve(rel.targetIdentifier);
            if (!sourceId || !targetId) continue;

            const parts = [`${sourceId} ->`, targetId];
            if (rel.description) parts.push(`"${rel.description}"`);
            if (rel.technology && rel.technology.length > 0) {
                parts.push(`"${rel.technology.join(", ")}"`);
            }
            this.writer.writeLine(parts.join(" "));
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private resolveIdPrefix(pathId: string): string | null {
        const dslId = this.registry.resolve(pathId);
        return dslId ? `${dslId} =` : null;
    }

    private filterTags(tags: string[]): string[] {
        return tags.filter((t) => !DEFAULT_TAGS.has(t));
    }

    private writeTagsLine(tags: string[]): void {
        const quoted = tags.map((t) => `"${t}"`).join(" ");
        this.writer.writeLine(`tags ${quoted}`);
    }

    private writeIncludes(include: Array<string>): void {
        for (const item of include) {
            if (item === "*") {
                this.writer.writeLine("include *");
            } else {
                const resolvedId = this.registry.resolve(item) ?? item;
                this.writer.writeLine(`include ${resolvedId}`);
            }
        }
    }

    private writeAutoLayout(layout: IAutoLayout): void {
        const isDefault =
            layout.rankSeparation === 300 && layout.nodeSeparation === 300;

        if (isDefault) {
            this.writer.writeLine(`autoLayout ${layout.direction}`);
        } else {
            this.writer.writeLine(
                `autoLayout ${layout.direction} ${layout.rankSeparation} ${layout.nodeSeparation}`
            );
        }
    }

    private writeStyleProperties(
        style: Record<string, unknown>,
        keys: string[]
    ): void {
        for (const key of keys) {
            const value = style[key];
            if (value === undefined || value === null) continue;
            this.writer.writeLine(`${key} ${value}`);
        }
    }
}
