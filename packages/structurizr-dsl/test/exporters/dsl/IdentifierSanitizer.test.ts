import { describe, expect, test } from "vitest";
import { sanitizeId } from "../../../src/exporters/dsl/IdentifierSanitizer";

describe("sanitizeId", () => {
    test("converts a simple name to camelCase", () => {
        expect(sanitizeId("Big Bank Plc")).toBe("bigBankPlc");
    });

    test("handles hyphenated words", () => {
        expect(sanitizeId("E-Mail System")).toBe("eMailSystem");
    });

    test("handles a single word", () => {
        expect(sanitizeId("Customer")).toBe("customer");
    });

    test("handles underscores as separators", () => {
        expect(sanitizeId("my_software_system")).toBe("mySoftwareSystem");
    });

    test("handles slashes as separators", () => {
        expect(sanitizeId("API / REST")).toBe("aPIREST");
    });

    test("prefixes underscore when name starts with a digit", () => {
        expect(sanitizeId("123 Service")).toBe("_123Service");
    });

    test("returns _element for an empty string", () => {
        expect(sanitizeId("")).toBe("_element");
    });

    test("returns _element for a string of only special chars", () => {
        expect(sanitizeId("---")).toBe("_element");
    });

    test("strips dots", () => {
        expect(sanitizeId("Big Bank plc.")).toBe("bigBankPlc");
    });

    test("preserves mixed case within a word segment", () => {
        expect(sanitizeId("ATM")).toBe("aTM");
    });

    test("handles colons as separators (path identifiers)", () => {
        expect(sanitizeId("SoftwareSystem:Big Bank Plc")).toBe(
            "softwareSystemBigBankPlc"
        );
    });
});
