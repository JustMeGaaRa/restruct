import {
    FC,
    PropsWithChildren,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { GroupNode, Text } from "@restruct/react-svg";
import { useViewMetadata } from "../../containers";
import {
    ELEMENT_DEPLOYMENT_NODE_DEFAULT_HEIGHT,
    ELEMENT_DEPLOYMENT_NODE_DEFAULT_WIDTH,
} from "../../types";
import { safeBoundingBox } from "../../utils";

export interface IDeploymentNode {
    type: "Deployment Node";
    identifier: string;
    name: string;
    description?: string;
    instances?: number;
}

export const DeploymentNode: FC<
    PropsWithChildren<{
        value: IDeploymentNode;
        borderWidth?: number;
        padding?: number;
    }>
> = ({ children, value, borderWidth = 2, padding = 16 }) => {
    const { getElementMetadataById } = useViewMetadata();
    const bbox = getElementMetadataById(value.identifier);
    const { x, y, width, height } = safeBoundingBox(
        bbox,
        ELEMENT_DEPLOYMENT_NODE_DEFAULT_HEIGHT,
        ELEMENT_DEPLOYMENT_NODE_DEFAULT_WIDTH
    );

    const groupRef = useRef<SVGGElement>(null);
    const [size, setSize] = useState({
        height: ELEMENT_DEPLOYMENT_NODE_DEFAULT_HEIGHT,
        width: ELEMENT_DEPLOYMENT_NODE_DEFAULT_WIDTH,
    });

    useLayoutEffect(() => {
        if (groupRef.current) {
            const { height, width } = groupRef.current.getBBox();
            setSize({ height, width });
        }
    }, [bbox, children]);

    return (
        <GroupNode
            ref={groupRef}
            id={value.identifier}
            className={"structurizr__element-deployment-node"}
            position={{ x, y }}
            height={height ?? size.height}
            width={width ?? size.width}
            backgroundColor={"none"}
            borderColor={"#535354"}
            borderDash={false}
        >
            <Text
                x={borderWidth + padding}
                y={(height ?? size.height) - borderWidth - padding - 16}
                fontSize={14}
                fontFamily={"Inter"}
                fill={"#E8E8E8"}
                style={{ whiteSpace: "pre" }}
                width={(width ?? size.width) - padding * 2 - borderWidth * 2}
            >
                {value.name}
            </Text>
            <Text
                x={borderWidth + padding}
                y={(height ?? size.height) - borderWidth - padding}
                fontSize={11}
                fontFamily={"Inter"}
                fill={"#A1A2A3"}
                style={{ whiteSpace: "pre" }}
                width={(width ?? size.width) - padding * 2 - borderWidth * 2}
            >
                {value.type}
            </Text>
            {children}
        </GroupNode>
    );
};
