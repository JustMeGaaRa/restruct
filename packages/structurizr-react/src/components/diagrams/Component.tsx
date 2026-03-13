import { FC, PropsWithChildren } from "react";
import { Connector } from "@restruct/react-svg";
import { useViewMetadata } from "../../containers";
import { Element } from "./Element";
import { ELEMENT_DEFAULT_HEIGHT, ELEMENT_DEFAULT_WIDTH } from "../../types";
import { safeBoundingBox } from "../../utils";

export interface IComponent {
    type: "Component";
    identifier: string;
    name: string;
    description?: string;
    technology: string[];
}

export const Component: FC<PropsWithChildren<{ value: IComponent }>> = ({
    value,
}) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, height, width } = safeBoundingBox(
        bbox,
        ELEMENT_DEFAULT_HEIGHT,
        ELEMENT_DEFAULT_WIDTH
    );

    return (
        <Element
            className={"structurizr__element-component"}
            value={value}
            position={{ x, y }}
            height={height}
            width={width}
        >
            <Connector height={height} width={width} placement={"top-left"} />
            <Connector height={height} width={width} placement={"top-center"} />
            <Connector height={height} width={width} placement={"top-right"} />
            <Connector
                height={height}
                width={width}
                placement={"middle-left"}
            />
            <Connector
                height={height}
                width={width}
                placement={"middle-right"}
            />
            <Connector
                height={height}
                width={width}
                placement={"bottom-left"}
            />
            <Connector
                height={height}
                width={width}
                placement={"bottom-center"}
            />
            <Connector
                height={height}
                width={width}
                placement={"bottom-right"}
            />
        </Element>
    );
};
