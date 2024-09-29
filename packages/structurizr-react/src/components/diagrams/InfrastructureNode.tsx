import { FC } from "react";
import { Connector } from "../../components";
import { useViewMetadata } from "../../containers";
import { Element } from "./Element";

export interface IInfrastructureNode {
    type: "Infrastructure Node";
    identifier: string;
    name: string;
    description?: string;
    instances?: string;
}

export const InfrastructureNode: FC<{
    value: IInfrastructureNode;
}> = ({
    value,
}) => {
        const { metadata } = useViewMetadata();
        const dimensions = metadata?.elements[value.identifier] ?? {
            x: 0,
            y: 0,
            height: 350,
            width: 300,
        };
        // TODO: pass these default values to the Element component directly
        const { height = 200, width = 200 } = dimensions;

        return (
            <Element
                className={"structurizr__element-infrastructure-node"}
                position={dimensions}
                value={value}
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
