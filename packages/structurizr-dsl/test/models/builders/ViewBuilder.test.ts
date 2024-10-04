import { describe, expect, test } from "vitest";
import { ViewsBuilder } from "../../../src/models";

describe("View Builder", () => {
    test("should build views object with no views", () => {
        const builder = new ViewsBuilder();
        const views = builder.build();

        expect(views).toBeDefined();
        expect(views.systemLandscape).toBeUndefined();
        expect(views.systemContexts).toBeDefined();
        expect(views.systemContexts.length).toBe(0);
        expect(views.containers).toBeDefined();
        expect(views.containers.length).toBe(0);
        expect(views.components).toBeDefined();
        expect(views.components.length).toBe(0);
    });

    test("should add a system landscape view", () => {
        const builder = new ViewsBuilder();
        const view = builder.systemLandscapeView("key");

        expect(view).toBeDefined();
        expect(view.key).toBe("key");
    });

    test("should add a system context view", () => {
        const builder = new ViewsBuilder();
        const view = builder.systemContextView("softwareSystem", "key");

        expect(view).toBeDefined();
        expect(view.softwareSystemIdentifier).toBe("softwareSystem");
        expect(view.key).toBe("key");
    });

    test("should add a container view", () => {
        const builder = new ViewsBuilder();
        const view = builder.containerView("softwareSystem", "key");

        expect(view).toBeDefined();
        expect(view.softwareSystemIdentifier).toBe("softwareSystem");
        expect(view.key).toBe("key");
    });

    test("should add a component view", () => {
        const builder = new ViewsBuilder();
        const view = builder.componentView("container", "key");

        expect(view).toBeDefined();
        expect(view.containerIdentifier).toBe("container");
        expect(view.key).toBe("key");
    });
});
