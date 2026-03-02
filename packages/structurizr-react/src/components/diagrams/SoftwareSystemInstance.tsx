import { Connector } from "@graph/svg";
import { FC } from "react";
import { Element } from "./Element";
import { useViewMetadata, useElementById } from "../../containers";

export interface ISoftwareSystemInstance {
    type: "Software System Instance";
    identifier: string;
    softwareSystemIdentifier: string;
}

export const SoftwareSystemInstance: FC<{
    value: ISoftwareSystemInstance;
}> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const dimensions = getElementMetadataById(value.identifier);
    const { height = 200, width = 200 } = dimensions ?? {
        height: 200,
        width: 200,
    };
    const { getSoftwareSystemById } = useElementById();
    const softwareSystem = getSoftwareSystemById(
        value.softwareSystemIdentifier
    );

    if (!softwareSystem) return null;

    return (
        <Element
            className={"structurizr__element-system-instance"}
            value={softwareSystem}
            position={dimensions}
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
