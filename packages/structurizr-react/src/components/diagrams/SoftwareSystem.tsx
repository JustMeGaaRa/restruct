import { Children, FC, PropsWithChildren } from "react";
import { Boundary } from "./Boundary";
import { Connector } from "@graph/svg";
import { useViewMetadata } from "../../containers";
import { Element } from "./Element";
import { safeBoundingBox } from "../../utils";
import { ELEMENT_DEFAULT_HEIGHT, ELEMENT_DEFAULT_WIDTH } from "../../types";

export interface ISoftwareSystem {
    type: "Software System";
    identifier: string;
    name: string;
    description?: string;
}

export const SoftwareSystem: FC<
    PropsWithChildren<{ value: ISoftwareSystem; isScope?: boolean }>
> = ({ children, value, isScope }) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, height, width } = safeBoundingBox(
        bbox,
        ELEMENT_DEFAULT_HEIGHT,
        ELEMENT_DEFAULT_WIDTH
    );

    return isScope || Children.count(children) > 0 ? (
        <Boundary
            className={"structurizr__boundary-system"}
            value={value}
            position={{ x, y }}
            height={height}
            width={width}
        >
            {children}
        </Boundary>
    ) : (
        <Element
            className={"structurizr__element-system"}
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
