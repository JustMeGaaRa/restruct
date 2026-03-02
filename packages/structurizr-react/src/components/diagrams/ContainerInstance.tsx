import { Connector } from "@graph/svg";
import { FC } from "react";
import { Element } from "./Element";
import { useViewMetadata, useElementById } from "../../containers";

export interface IContainerInstance {
    type: "Container Instance";
    identifier: string;
    containerIdentifier: string;
}

export const ContainerInstance: FC<{
    value: IContainerInstance;
}> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const dimensions = getElementMetadataById(value.identifier);
    const { height = 200, width = 200 } = dimensions ?? {
        height: 200,
        width: 200,
    };
    const { getContainerById } = useElementById();
    const container = getContainerById(value.containerIdentifier);

    if (!container) return null;

    return (
        <Element
            className={"structurizr__element-container-instance"}
            value={container}
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
