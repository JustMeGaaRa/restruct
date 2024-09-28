export class Technology {
    constructor(name: string) {
        this.name = name;
    }

    public readonly name!: string;

    static from(text: string, separator: string = "/"): Technology[] {
        return (
            text
                ?.split(separator)
                ?.map((name) => new Technology(name.trim())) ?? []
        );
    }
}
