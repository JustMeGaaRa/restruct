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
    background: "#ffffff",
    stroke: "#ffffff",
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
    color: "#8A8B8C",
    fontSize: 24,
    opacity: 100,
    position: 50,
    routing: RoutingStyle.Direct,
    style: LineStyle.Dashed,
    thickness: 2,
    width: 200,
    properties: {},
};

export const RestructTheme: ITheme = {
    name: "re:struct",
    description:
        "Default theme for elements and relationships in re:struct application",
    elements: [
        {
            tag: Tag.Element.name,
            ...RestructElementStyle,
        },
    ],
    relationships: [
        {
            tag: Tag.Relationship.name,
            ...RestructRelationshipStyle,
        },
    ],
};
