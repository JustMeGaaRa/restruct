import { Color } from "./Color";
import { LineStyle } from "./LineStyle";
import { Properties } from "./Properties";
import { RoutingStyle } from "./RoutingStyle";

export interface IRelationshipStyle extends Record<string, unknown> {
    color: Color;
    fontSize: number;
    opacity: number;
    position: number;
    properties: Properties;
    routing: RoutingStyle;
    style: LineStyle;
    thickness: number;
    width: number;
}
