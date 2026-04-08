import { beforeAll, describe, expect, test } from "vitest";
import { IElement, IWorkspace, View, ViewType, workspace } from "../../src";
import {
    getViewPath,
    zoomIntoElementScope,
    zoomOutToParentScope,
} from "../../src/utils/breadcrumbs";

describe("getViewPath", () => {
    let workspace: IWorkspace;

    beforeAll(() => {
        workspace = createWorkspaceForBreadcrumbs();
    });

    test("should return empty array for system landscape view", () => {
        const breadcrumbs = getViewPath(workspace, systemLandscape);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(0);
    });

    test("should return breadcrumbs with system context view for a 'Software System A' element", () => {
        const breadcrumbs = getViewPath(workspace, systemContextView);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0]?.element?.identifier).toBe(
            softwareSystemA.identifier
        );
        expect(breadcrumbs[0]?.view?.type).toBe(ViewType.SystemContext);
    });

    test("should return breadcrumbs with container view for a 'Container A' element", () => {
        const breadcrumbs = getViewPath(workspace, containerView);

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

    test("should return breadcrumbs with component view for a 'Component A' element", () => {
        const breadcrumbs = getViewPath(workspace, componentView);

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

    test("should return breadcrumbs with deployment view for a 'Deployment' element", () => {
        const breadcrumbs = getViewPath(workspace, deploymentView);

        expect(breadcrumbs).toBeDefined();
        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0]?.element).toBeUndefined();
        expect(breadcrumbs[0]?.view?.type).toBe(ViewType.Deployment);
    });
});

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

let person: IElement;
let softwareSystemA: IElement;
let containerA: IElement;
let componentA: IElement;
let systemLandscape: View;
let systemContextView: View;
let containerView: View;
let componentView: View;
let deploymentView: View;

// prettier-ignore
const createWorkspaceForBreadcrumbs = () => {
    return workspace("Breadcrumbs Workspace", "Breadcrumbs Description", _ => {
        _.model(_ => {
           person =  _.person("Person", "Person Description");

            softwareSystemA = _.softwareSystem("Software System A", "Software System Description", _ => {
                containerA = _.container("Container A", "Container Description", _ => {
                    componentA = _.component("Component A", "Component Description");
                });

                _.container("Container B", "Container Description 2", _ => {
                    _.component("Component B", "Component Description 2");

                    _.component("Component C", "Component Description 3");
                });
            });

            _.softwareSystem("Software System B", "Software System Description 2", _ => {
                _.container("Container C", "Container Description 2", _ => {
                    _.component("Component D", "Component Description 2");
                });
            });
        })

        _.views(_ => {
            systemLandscape = _.systemLandscapeView("System Landscape");
            systemContextView = _.systemContextView(softwareSystemA.identifier, "System Context view for Software System A");
            containerView = _.containerView(softwareSystemA.identifier, "Container view for Container A");
            componentView = _.componentView(containerA.identifier, "Component view for Component A");
            deploymentView = _.deploymentView("Deployment", "Production", "Deployment View for Production");
        })
    });
};
