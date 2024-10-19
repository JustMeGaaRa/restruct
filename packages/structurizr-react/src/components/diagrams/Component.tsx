import { FC, PropsWithChildren } from "react";
import { Connector } from "@graph/svg";
import { useViewMetadata } from "../../containers";
import { Element } from "./Element";

export interface IComponent {
    type: "Component";
    identifier: string;
    name: string;
    description?: string;
    technology: string[];
}

export const Component: FC<PropsWithChildren<{ value: IComponent }>> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const dimensions = getElementMetadataById(value.identifier);
    const { height = 200, width = 200 } = dimensions ?? { height: 200, width: 200 };

    return (
        <Element
            className={"structurizr__element-component"}
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
