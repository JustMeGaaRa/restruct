import { FC, PropsWithChildren } from "react";
import { Connector } from "@graph/svg";
import { useViewMetadata } from "../../containers";
import { Element } from "./Element";

export interface IPerson {
    type: "Person";
    identifier: string;
    name: string;
    description?: string;
}

export const Person: FC<PropsWithChildren<{
    value: IPerson;
}>> = ({
    value,
}) => {
        const { getElementMetadataById } = useViewMetadata();
        const dimensions = getElementMetadataById(value.identifier);
        const { height = 200, width = 200 } = dimensions ?? { height: 200, width: 200 };

        return (
            <Element
                className={"structurizr__element-person"}
                value={value}
                position={dimensions}
                height={height}
                width={width}
            >
                <Connector height={height} width={width} placement={"top-left"} />
                <Connector height={height} width={width} placement={"top-center"} />
                <Connector height={height} width={width} placement={"top-right"} />
                <Connector height={height} width={width} placement={"middle-left"} />
                <Connector height={height} width={width} placement={"middle-right"} />
                <Connector height={height} width={width} placement={"bottom-left"} />
                <Connector height={height} width={width} placement={"bottom-center"} />
                <Connector height={height} width={width} placement={"bottom-right"} />
            </Element>
        );
    };
