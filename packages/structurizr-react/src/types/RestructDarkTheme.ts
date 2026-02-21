import {
    IElementStyle,
    IRelationshipStyle,
    ITheme,
    LineStyle,
    RoutingStyle,
    ShapeType,
    Tag,
} from "@structurizr/dsl";

export const RestructElementStyle: IElementStyle = {
    shape: ShapeType.RoundedBox,
    icon: "",
    width: 200,
    height: 200,
    background: "#222425",
    stroke: "#535354",
    strokeWidth: 2,
    color: "#E8E8E8",
    fontSize: 24,
    border: LineStyle.Solid,
    opacity: 100,
    metadata: true,
    description: true,
    properties: {},
};

export const RestructRelationshipStyle: IRelationshipStyle = {
    color: "#E8E8E8",
    fontSize: 24,
    opacity: 100,
    position: 50,
    routing: RoutingStyle.Direct,
    style: LineStyle.Dashed,
    thickness: 2,
    width: 200,
    properties: {},
};

export const RestructDarkTheme: ITheme = {
    name: "re:struct",
    description:
        "Default theme for elements and relationships in re:struct application",
    elements: [
        {
            tag: Tag.Element.name,
            ...RestructElementStyle,
        },
        {
            tag: Tag.Person.name,
            shape: ShapeType.Person,
        },
        {
            tag: Tag.SoftwareSystem.name,
            shape: ShapeType.RoundedBox,
        },
        {
            tag: Tag.Container.name,
            shape: ShapeType.RoundedBox,
        },
        {
            tag: Tag.Component.name,
            shape: ShapeType.RoundedBox,
        },
    ],
    relationships: [
        {
            tag: Tag.Relationship.name,
            ...RestructRelationshipStyle,
        },
    ],
};
