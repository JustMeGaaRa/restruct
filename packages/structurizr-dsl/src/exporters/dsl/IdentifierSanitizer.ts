/**
 * Converts an element name to a valid Structurizr DSL identifier.
 *
 * DSL identifiers must match: [a-zA-Z_][a-zA-Z0-9_]*
 *
 * Examples:
 *   "Big Bank Plc"          → "bigBankPlc"
 *   "E-Mail System"         → "eMailSystem"
 *   "123 Service"           → "_123Service"
 *   "API / REST"            → "apiRest"
 *   ""                      → "_element"
 */
export function sanitizeId(name: string): string {
    const words = name.split(/[\s\-_:/\\.]+/).filter((w) => w.length > 0);

    const camelCase = words
        .map((word, index) => {
            const clean = word.replace(/[^a-zA-Z0-9]/g, "");
            if (!clean) return "";
            return index === 0
                ? clean.charAt(0).toLowerCase() + clean.slice(1)
                : clean.charAt(0).toUpperCase() + clean.slice(1);
        })
        .join("");

    if (!camelCase) return "_element";

    return /^\d/.test(camelCase) ? `_${camelCase}` : camelCase;
}
