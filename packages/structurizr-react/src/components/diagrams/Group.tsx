import {
    FC,
    PropsWithChildren,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { GroupNode, Text } from "@graph/svg";
import { useViewMetadata } from "../../containers";

export interface IGroup {
    type: "Group";
    identifier: string;
    name: string;
}

export const Group: FC<
    PropsWithChildren<{
        value: IGroup;
        borderWidth?: number;
        padding?: number;
    }>
> = ({ children, value, borderWidth = 2, padding = 16 }) => {
    const { getElementMetadataById } = useViewMetadata();
    const dimensions = getElementMetadataById(value.identifier);

    const groupRef = useRef<SVGGElement>(null);
    const [size, setSize] = useState({ height: 200, width: 200 });

    useLayoutEffect(() => {
        if (groupRef.current) {
            const { height, width } = groupRef.current.getBBox();
            setSize({ height, width });
        }
    }, []);

    return (
        <GroupNode
            ref={groupRef}
            id={value.identifier}
            className={"structurizr__element-group"}
            position={dimensions}
            height={size.height}
            width={size.width}
            backgroundColor={"none"}
            borderColor={"#535354"}
            borderDash={false}
        >
            <Text
                x={borderWidth + padding}
                y={size.height - borderWidth - padding - 16}
                fontSize={14}
                fontFamily={"Inter"}
                fill={"#E8E8E8"}
                style={{ whiteSpace: "pre" }}
                width={size.width - padding * 2 - borderWidth * 2}
            >
                {value.name}
            </Text>
            <Text
                x={borderWidth + padding}
                y={size.height - borderWidth - padding}
                fontSize={11}
                fontFamily={"Inter"}
                fill={"#A1A2A3"}
                style={{ whiteSpace: "pre" }}
                width={size.width - padding * 2 - borderWidth * 2}
            >
                {value.type}
            </Text>
            {children}
        </GroupNode>
    );
};
