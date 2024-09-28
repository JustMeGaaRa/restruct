export class Tag {
    constructor(name: string) {
        this.name = name;
    }

    public readonly name!: string;

    static Workspace = new Tag("Workspace");
    static Element = new Tag("Element");
    static Group = new Tag("Group");
    static Person = new Tag("Person");
    static SoftwareSystem = new Tag("Software System");
    static Container = new Tag("Container");
    static Component = new Tag("Component");
    static DeploymentNode = new Tag("Deployment Node");
    static InfrastructureNode = new Tag("Infrastructure Node");
    static SoftwareSystemInstance = new Tag("Software System Instance");
    static ContainerInstance = new Tag("Container Instance");
    static Relationship = new Tag("Relationship");

    static from(text: string, separator: string = " "): Tag[] {
        return (
            text?.split(separator)?.map((name) => new Tag(name.trim())) ?? []
        );
    }
}
