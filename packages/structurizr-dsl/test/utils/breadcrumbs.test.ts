import { beforeAll, describe, expect, test } from "vitest";
import { IElement, IWorkspace, ViewType, workspace } from "../../src";
import {
    zoomIntoElementScope,
    zoomOutToParentScope,
} from "../../src/utils/breadcrumbs";

describe("zoomIntoElementScope", () => {
    let workspace: IWorkspace;

    beforeAll(() => {
        workspace = createWorkspaceForBreadcrumbs();
    });

    test("should throw error for undefined workspace", () => {
        expect(() => zoomIntoElementScope(undefined!, person)).toThrow();
    });

    test("should throw error for undefined element", () => {
        expect(() => zoomIntoElementScope(workspace, undefined!)).toThrow();
    });

    test("should throw error for a 'Person' element", () => {
        expect(() => zoomIntoElementScope(workspace, person)).toThrow();
    });

    test("should return breadcrumbs with container view for a 'Software System A' element", () => {
        const breadcrumbs = zoomIntoElementScope(workspace, softwareSystemA);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[0]?.view?.type).toBe(ViewType.SystemContext);
        expect(breadcrumbs[1]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[1]?.view?.type).toBe(ViewType.Container);
    });

    test("should return breadcrumbs for a 'Container A' element", () => {
        const breadcrumbs = zoomIntoElementScope(workspace, containerA);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(3);
        expect(breadcrumbs[0]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[0]?.view?.type).toBe(ViewType.SystemContext);
        expect(breadcrumbs[1]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[1]?.view?.type).toBe(ViewType.Container);
        expect(breadcrumbs[2]?.element?.identifier).toBe(containerA.identifier);
        expect(breadcrumbs[2]?.view?.type).toBe(ViewType.Component);
    });

    test("should throw error for a 'Component A' element", () => {
        expect(() => zoomIntoElementScope(workspace, componentA)).toThrow();
    });
});

describe("zoomOutToParentScope", () => {
    let workspace: IWorkspace;

    beforeAll(() => {
        workspace = createWorkspaceForBreadcrumbs();
    });

    test("should throw error for undefined workspace", () => {
        expect(() => zoomOutToParentScope(undefined!, person)).toThrow();
    });

    test("should return breadcrumbs with system landscape view for undefined element", () => {
        const breadcrumbs = zoomOutToParentScope(workspace, undefined);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0]?.element).toBeUndefined();
        expect(breadcrumbs[0]?.view?.type).toEqual(ViewType.SystemLandscape);
    });

    test("should throw error for a 'Person' element", () => {
        expect(() => zoomOutToParentScope(workspace, person)).toThrow();
    });

    test("should return breadcrumbs with system context view for a 'Software System A' element", () => {
        const breadcrumbs = zoomOutToParentScope(workspace, softwareSystemA);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[0]?.view?.type).toBe(ViewType.SystemContext);
    });

    test("should return breadcrumbs with container view for a 'Container A' element", () => {
        const breadcrumbs = zoomOutToParentScope(workspace, containerA);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[0]?.view?.type).toBe(ViewType.SystemContext);
        expect(breadcrumbs[1]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[1]?.view?.type).toBe(ViewType.Container);
    });

    test("should throw error for a 'Component A' element", () => {
        expect(() => zoomOutToParentScope(workspace, componentA)).toThrow();
    });
});

// prettier-ignore
let person: IElement;
let softwareSystemA: IElement;
let softwareSystemB: IElement;
let containerA: IElement;
let containerB: IElement;
let containerC: IElement;
let componentA: IElement;
let componentB: IElement;
let componentC: IElement;
let componentD: IElement;

// prettier-ignore
const createWorkspaceForBreadcrumbs = () => {
    return workspace("Breadcrumbs Workspace", "Breadcrumbs Description", _ => {
        _.model(_ => {
           person =  _.person("Person", "Person Description");

            softwareSystemA = _.softwareSystem("Software System A", "Software System Description", _ => {
                containerA = _.container("Container A", "Container Description", _ => {
                    componentA = _.component("Component A", "Component Description");
                });

                containerB = _.container("Container B", "Container Description 2", _ => {
                    componentB = _.component("Component B", "Component Description 2");

                    componentC = _.component("Component C", "Component Description 3");
                });
            });

            softwareSystemB = _.softwareSystem("Software System B", "Software System Description 2", _ => {
                containerC = _.container("Container C", "Container Description 2", _ => {
                    componentD = _.component("Component D", "Component Description 2");
                });
            });
        })

        _.views(_ => {
            _.systemLandscapeView("System Landscape");

            _.systemContextView(softwareSystemA.identifier, "System Context view for Software System A");

            _.containerView(containerA.identifier, "Container view for Container A");

            _.componentView(componentA.identifier, "Component view for Component A");

            _.deploymentView("Deployment", "Production", "Deployment View for Production");
        })
    });
};
