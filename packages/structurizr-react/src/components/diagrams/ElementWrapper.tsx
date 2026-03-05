import { IElement } from "@structurizr/dsl";
import { FC, PropsWithChildren } from "react";
import { Element } from "./Element";
import { useViewMetadata } from "../../containers";
import { Connector } from "@graph/svg";
import {
    ELEMENT_MODEL_DEFAULT_HEIGHT,
    ELEMENT_MODEL_DEFAULT_WIDTH,
} from "../../types";
import { safeBoundingBox } from "../../utils";

export const ElementWrapper: FC<
    PropsWithChildren<{
        value: IElement;
    }>
> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, width } = safeBoundingBox(
        bbox,
        ELEMENT_MODEL_DEFAULT_HEIGHT,
        ELEMENT_MODEL_DEFAULT_WIDTH
    );

    return (
        <Element
            className={"structurizr__element-model"}
            value={value}
            position={{ x, y }}
            height={ELEMENT_MODEL_DEFAULT_HEIGHT}
            width={width}
        >
            <Connector
                height={ELEMENT_MODEL_DEFAULT_HEIGHT}
                width={width}
                placement={"top-center"}
            />
            <Connector
                height={ELEMENT_MODEL_DEFAULT_HEIGHT}
                width={width}
                placement={"bottom-center"}
            />
        </Element>
    );
};
