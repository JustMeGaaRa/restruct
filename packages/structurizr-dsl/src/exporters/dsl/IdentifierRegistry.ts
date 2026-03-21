import { sanitizeId } from "./IdentifierSanitizer";

/**
 * Tracks DSL identifier assignments for workspace elements.
 *
 * Only elements that are actually referenced (in relationships or views)
 * receive a DSL identifier. Deduplicates by appending _2, _3, etc. when
 * two elements produce the same sanitized name.
 */
export class IdentifierRegistry {
    private readonly pathToDslId = new Map<string, string>();
    private readonly usedIds = new Set<string>();

    register(pathId: string, name: string): string {
        if (this.pathToDslId.has(pathId)) {
            return this.pathToDslId.get(pathId)!;
        }

        const base = sanitizeId(name);
        let dslId = base;

        if (this.usedIds.has(dslId)) {
            let counter = 2;
            while (this.usedIds.has(`${base}_${counter}`)) {
                counter++;
            }
            dslId = `${base}_${counter}`;
        }

        this.usedIds.add(dslId);
        this.pathToDslId.set(pathId, dslId);
        return dslId;
    }

    resolve(pathId: string): string | undefined {
        return this.pathToDslId.get(pathId);
    }

    has(pathId: string): boolean {
        return this.pathToDslId.has(pathId);
    }
}
