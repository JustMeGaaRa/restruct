import { FC } from "react";
import { Connector } from "@restruct/react-svg";
import { useViewMetadata } from "../../containers";
import { Element } from "./Element";
import { ELEMENT_DEFAULT_HEIGHT, ELEMENT_DEFAULT_WIDTH } from "../../types";
import { safeBoundingBox } from "../../utils";

export interface IInfrastructureNode {
    type: "Infrastructure Node";
    identifier: string;
    name: string;
    description?: string;
    instances?: string;
}

export const InfrastructureNode: FC<{
    value: IInfrastructureNode;
}> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, height, width } = safeBoundingBox(
        bbox,
        ELEMENT_DEFAULT_HEIGHT,
        ELEMENT_DEFAULT_WIDTH
    );

    return (
        <Element
            className={"structurizr__element-infrastructure-node"}
            position={{ x, y }}
            value={value}
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
