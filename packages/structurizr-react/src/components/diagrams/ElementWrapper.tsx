import { IElement } from "@structurizr/dsl";
import { FC, PropsWithChildren } from "react";
import { Element } from "./Element";
import { useViewMetadata } from "../../containers";
import { Connector } from "@graph/svg";

// TODO: pass height and width from metadata but make height 70 for this view
export const ElementWrapper: FC<
    PropsWithChildren<{
        value: IElement;
    }>
> = ({ value }) => {
    const { getElementMetadataById } = useViewMetadata();
    const dimensions = getElementMetadataById(value.identifier);
    const { height = 100, width = 200 } = dimensions ?? {
        height: 100,
        width: 200,
    };

    return (
        <Element
            className={"structurizr__element-model"}
            value={value}
            position={dimensions}
            height={70}
            width={width}
        >
            <Connector height={70} width={width} placement={"top-center"} />
            <Connector height={70} width={width} placement={"bottom-center"} />
        </Element>
    );
};
