export class StructurizrDslWriter {
    private readonly lines: string[] = [];
    private indentLevel = 0;
    private readonly indentUnit: string;

    constructor(indentSize = 4) {
        this.indentUnit = " ".repeat(indentSize);
    }

    writeLine(text: string): void {
        if (text === "") {
            this.lines.push("");
        } else {
            this.lines.push(
                `${this.indentUnit.repeat(this.indentLevel)}${text}`
            );
        }
    }

    openBlock(header: string): void {
        this.writeLine(`${header} {`);
        this.indentLevel++;
    }

    closeBlock(): void {
        this.indentLevel--;
        this.writeLine("}");
    }

    toString(): string {
        return this.lines.join("\n");
    }
}
