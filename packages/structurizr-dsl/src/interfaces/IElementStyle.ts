import { ShapeType } from "./ShapeType";
import { Properties } from "./Properties";
import { Url } from "./Url";
import { Color } from "./Color";
import { LineStyle } from "./LineStyle";

export interface IElementStyle {
    background: Color;
    border: LineStyle;
    color: Color;
    description: boolean;
    fontSize: number;
    height: number;
    icon: Url | string;
    metadata: boolean;
    opacity: number;
    properties: Properties;
    shape: ShapeType | string;
    stroke: Color;
    strokeWidth: number;
    width: number;
}
