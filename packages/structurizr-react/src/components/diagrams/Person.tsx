import { FC, PropsWithChildren } from "react";
import { Connector } from "../";
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
        const { metadata } = useViewMetadata();
        const dimensions = metadata?.elements[value.identifier] ?? {
            x: 0,
            y: 0,
            height: 200,
            width: 200,
        };
        // TODO: pass these default values to the Element component directly
        const { height = 200, width = 200 } = dimensions;

        return (
            <Element
                className={"structurizr__element-person"}
                value={value}
                position={dimensions}
                height={dimensions.height}
                width={dimensions.width}
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
