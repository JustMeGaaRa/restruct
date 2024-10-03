export type All = "*";

export class Identifier {
    private constructor(public readonly identifier: string) {
        this.identifier = identifier;
    }

    static createOrDefault(identifier?: string): Identifier {
        return new Identifier(identifier ?? crypto.randomUUID());
    }

    static parse(identifier: string): Identifier {
        return identifier
            ? new Identifier(identifier)
            : throwError("An identifier must be provided.");
    }

    public equals(identifier: Identifier): boolean {
        return this.identifier === identifier.identifier;
    }

    public toString(): string {
        return this.identifier;
    }
}

function throwError(message: string): never {
    throw new Error(message);
}
