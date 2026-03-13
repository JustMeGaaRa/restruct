import { Connector } from "@restruct/react-svg";
import { FC } from "react";
import { Element } from "./Element";
import { useViewMetadata, useWorkspace } from "../../containers";
import { safeBoundingBox } from "../../utils";
import { ELEMENT_DEFAULT_HEIGHT, ELEMENT_DEFAULT_WIDTH } from "../../types";

export interface ISoftwareSystemInstance {
    type: "Software System Instance";
    identifier: string;
    softwareSystemIdentifier: string;
}

export const SoftwareSystemInstance: FC<{
    value: ISoftwareSystemInstance;
}> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, height, width } = safeBoundingBox(
        bbox,
        ELEMENT_DEFAULT_HEIGHT,
        ELEMENT_DEFAULT_WIDTH
    );
    const { getSoftwareSystemById } = useWorkspace();
    const softwareSystem = getSoftwareSystemById(
        value.softwareSystemIdentifier
    );

    if (!softwareSystem) return null;

    return (
        <Element
            className={"structurizr__element-system-instance"}
            value={softwareSystem}
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
