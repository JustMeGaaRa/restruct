import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import {
    IElementStyle,
    IRelationshipStyle,
    ITheme,
    IWorkspace,
} from "../../src/interfaces";
import {
    ElementStyleCollection,
    RelationshipStyleCollection,
    Style,
} from "../../src/models";
import { mergeStyles, applyTheme, fetchTheme } from "../../src/utils/themes";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeWorkspace = (
    elementStyles: ElementStyleCollection = [],
    relationshipStyles: RelationshipStyleCollection = []
): IWorkspace => ({
    version: 1,
    model: {
        groups: [],
        people: [],
        softwareSystems: [],
        deploymentEnvironments: [],
        relationships: [],
    },
    views: {
        systemContexts: [],
        containers: [],
        components: [],
        deployments: [],
        configuration: {
            styles: {
                elements: elementStyles,
                relationships: relationshipStyles,
            },
            themes: [],
        },
    },
});

const makeTheme = (
    elements: ElementStyleCollection = [],
    relationships: RelationshipStyleCollection = []
): ITheme => ({
    name: "Test Theme",
    description: "A theme used in tests",
    elements,
    relationships,
});

// ---------------------------------------------------------------------------
// mergeStyles
// ---------------------------------------------------------------------------

describe("mergeStyles", () => {
    test("returns the target style unchanged when there are no tags", () => {
        const target: IElementStyle = {
            background: "#ffffff",
        } as IElementStyle;

        const tagStyles: Array<Style<IElementStyle>> = [
            { tag: "Element", background: "#000000" },
        ];

        const result = mergeStyles(target, tagStyles, []);

        expect(result).toEqual(target);
    });

    test("returns the target style unchanged when tags array is empty", () => {
        const target: IElementStyle = {
            background: "#ffffff",
        } as IElementStyle;

        const tagStyles: Array<Style<IElementStyle>> = [
            { tag: "Element", background: "#000000" },
        ];

        const result = mergeStyles(target, tagStyles, []);

        expect(result).toEqual(target);
    });

    test("applies a matching tag style over the target style", () => {
        const target: IElementStyle = {
            background: "#ffffff",
            color: "#000000",
        } as IElementStyle;

        const tagStyles: Array<Style<IElementStyle>> = [
            { tag: "Element", background: "#ff0000" },
        ];

        const result = mergeStyles(target, tagStyles, [{ name: "Element" }]);

        expect(result.background).toBe("#ff0000");
        expect(result.color).toBe("#000000");
    });

    test("does not overwrite a target property with undefined from tag style", () => {
        const target: IElementStyle = {
            background: "#ffffff",
            color: "#000000",
        } as IElementStyle;

        // tag style explicitly sets color to undefined
        const tagStyles: Array<Style<IElementStyle>> = [
            { tag: "Element", background: "#ff0000", color: undefined },
        ];

        const result = mergeStyles(target, tagStyles, [{ name: "Element" }]);

        expect(result.background).toBe("#ff0000");
        // undefined from tag style should fall back to target value
        expect(result.color).toBe("#000000");
    });

    test("skips tags that have no matching tag style", () => {
        const target: IElementStyle = {
            background: "#ffffff",
        } as IElementStyle;
        const tagStyles: Array<Style<IElementStyle>> = [
            { tag: "Known", background: "#ff0000" },
        ];

        const result = mergeStyles(target, tagStyles, [{ name: "Unknown" }]);

        expect(result.background).toBe("#ffffff");
    });

    test("applies multiple tag styles in order", () => {
        const target: IElementStyle = {
            background: "#ffffff",
            color: "#000000",
        } as IElementStyle;

        const tagStyles: Array<Style<IElementStyle>> = [
            { tag: "First", background: "#aabbcc" },
            { tag: "Second", color: "#112233" },
        ];

        const result = mergeStyles(target, tagStyles, [
            { name: "First" },
            { name: "Second" },
        ]);

        expect(result.background).toBe("#aabbcc");
        expect(result.color).toBe("#112233");
    });

    test("works with an empty tag style array", () => {
        const target: IElementStyle = {
            background: "#ffffff",
        } as IElementStyle;

        const result = mergeStyles(target, [], [{ name: "Element" }]);

        expect(result).toEqual(target);
    });

    test("works with relationship styles", () => {
        const target: IRelationshipStyle = {
            color: "#000000",
        } as IRelationshipStyle;

        const tagStyles: Array<Style<IRelationshipStyle>> = [
            { tag: "Relationship", color: "#ff0000" },
        ];

        const result = mergeStyles(target, tagStyles, [
            { name: "Relationship" },
        ]);

        expect(result.color).toBe("#ff0000");
    });
});

// ---------------------------------------------------------------------------
// applyTheme
// ---------------------------------------------------------------------------

describe("applyTheme", () => {
    test("appends theme element styles to existing workspace element styles", () => {
        const existing: Style<IElementStyle> = {
            tag: "Element",
            background: "#ffffff",
        };
        const fromTheme: Style<IElementStyle> = {
            tag: "Person",
            background: "#aabbcc",
        };

        const workspace = makeWorkspace([existing]);
        const theme = makeTheme([fromTheme]);

        const result = applyTheme(workspace, theme);

        const elements = result.views.configuration.styles.elements;
        expect(elements).toHaveLength(2);
        expect(elements[0]).toEqual(existing);
        expect(elements[1]).toEqual(fromTheme);
    });

    test("appends theme relationship styles to existing workspace relationship styles", () => {
        const existing: Style<IRelationshipStyle> = {
            tag: "Relationship",
            color: "#000000",
        };
        const fromTheme: Style<IRelationshipStyle> = {
            tag: "Async",
            color: "#ff0000",
        };

        const workspace = makeWorkspace([], [existing]);
        const theme = makeTheme([], [fromTheme]);

        const result = applyTheme(workspace, theme);

        const relationships = result.views.configuration.styles.relationships;
        expect(relationships).toHaveLength(2);
        expect(relationships[0]).toEqual(existing);
        expect(relationships[1]).toEqual(fromTheme);
    });

    test("handles a theme with no element styles (null/undefined)", () => {
        const workspace = makeWorkspace();
        // ITheme allows arrays to be missing
        const theme = makeTheme(undefined as unknown as ElementStyleCollection);

        const result = applyTheme(workspace, theme);

        expect(result.views.configuration.styles.elements).toHaveLength(0);
    });

    test("handles a theme with no relationship styles (null/undefined)", () => {
        const workspace = makeWorkspace();
        const theme = makeTheme(
            [],
            undefined as unknown as RelationshipStyleCollection
        );

        const result = applyTheme(workspace, theme);

        expect(result.views.configuration.styles.relationships).toHaveLength(0);
    });

    test("does not mutate the original workspace", () => {
        const workspace = makeWorkspace();
        const theme = makeTheme([{ tag: "Person", background: "#aabbcc" }]);

        applyTheme(workspace, theme);

        expect(workspace.views.configuration.styles.elements).toHaveLength(0);
    });

    test("preserves all other workspace properties unchanged", () => {
        const workspace = makeWorkspace();
        workspace.name = "My Workspace";

        const theme = makeTheme();
        const result = applyTheme(workspace, theme);

        expect(result.name).toBe("My Workspace");
        expect(result.model).toBe(workspace.model);
        expect(result.version).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// fetchTheme
// ---------------------------------------------------------------------------

describe("fetchTheme", () => {
    const themeUrl = "https://example.com/theme.json";

    const mockTheme: ITheme = {
        name: "Remote Theme",
        description: "A theme fetched from a remote URL",
        elements: [{ tag: "Element", background: "#ff0000" }],
        relationships: [],
    };

    beforeEach(() => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockTheme),
            })
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test("returns a parsed ITheme when the response is ok", async () => {
        const result = await fetchTheme(themeUrl);

        expect(result).toEqual(mockTheme);
    });

    test("calls fetch with the provided URL", async () => {
        await fetchTheme(themeUrl);

        expect(fetch).toHaveBeenCalledWith(themeUrl);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("throws an error when the response is not ok", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
            })
        );

        await expect(fetchTheme(themeUrl)).rejects.toThrow("Theme not found");
    });

    test("propagates fetch network errors", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockRejectedValue(new Error("Network error"))
        );

        await expect(fetchTheme(themeUrl)).rejects.toThrow("Network error");
    });
});
