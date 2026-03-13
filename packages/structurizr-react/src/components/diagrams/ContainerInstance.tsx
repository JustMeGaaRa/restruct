import { Connector } from "@restruct/react-svg";
import { FC } from "react";
import { Element } from "./Element";
import { useViewMetadata, useWorkspace } from "../../containers";
import { ELEMENT_DEFAULT_HEIGHT, ELEMENT_DEFAULT_WIDTH } from "../../types";
import { safeBoundingBox } from "../../utils";

export interface IContainerInstance {
    type: "Container Instance";
    identifier: string;
    containerIdentifier: string;
}

export const ContainerInstance: FC<{
    value: IContainerInstance;
}> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, height, width } = safeBoundingBox(
        bbox,
        ELEMENT_DEFAULT_HEIGHT,
        ELEMENT_DEFAULT_WIDTH
    );
    const { getContainerById } = useWorkspace();
    const container = getContainerById(value.containerIdentifier);

    if (!container) return null;

    return (
        <Element
            className={"structurizr__element-container-instance"}
            value={container}
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
