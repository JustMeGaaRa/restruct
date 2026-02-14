import {
    FC,
    PropsWithChildren,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { GroupNode, Text } from "@graph/svg";

export interface IBoundary {
    type: string;
    identifier: string;
    name: string;
}

export const Boundary: FC<
    PropsWithChildren<{
        value: IBoundary;
        className?: string;
        position?: { x: number; y: number };
        height?: number;
        width?: number;
        borderWidth?: number;
        padding?: number;
    }>
> = ({
    children,
    value,
    className,
    position,
    borderWidth = 2,
    padding = 16,
}) => {
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
            className={className}
            position={position}
            height={size.height}
            width={size.width}
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
