import { describe, beforeEach, expect, test } from "vitest";
import { StructurizrDslWriter } from "../../../src/exporters/dsl/StructurizrDslWriter";

describe("DslWriter", () => {
    let writer: StructurizrDslWriter;

    beforeEach(() => {
        writer = new StructurizrDslWriter();
    });

    test("writes a plain line with no indentation at root level", () => {
        writer.writeLine("workspace");
        expect(writer.toString()).toBe("workspace");
    });

    test("writes an empty line as a blank string", () => {
        writer.writeLine("first");
        writer.writeLine("");
        writer.writeLine("second");
        expect(writer.toString()).toBe("first\n\nsecond");
    });

    test("openBlock increases indent and appends {", () => {
        writer.openBlock("workspace");
        writer.writeLine("model");
        writer.closeBlock();
        expect(writer.toString()).toBe("workspace {\n    model\n}");
    });

    test("nested blocks increase indentation correctly", () => {
        writer.openBlock("workspace");
        writer.openBlock("model");
        writer.writeLine('person "Alice"');
        writer.closeBlock();
        writer.closeBlock();
        expect(writer.toString()).toBe(
            'workspace {\n    model {\n        person "Alice"\n    }\n}'
        );
    });

    test("custom indent size is respected", () => {
        const twoSpaceWriter = new StructurizrDslWriter(2);
        twoSpaceWriter.openBlock("workspace");
        twoSpaceWriter.writeLine("item");
        twoSpaceWriter.closeBlock();
        expect(twoSpaceWriter.toString()).toBe("workspace {\n  item\n}");
    });
});
