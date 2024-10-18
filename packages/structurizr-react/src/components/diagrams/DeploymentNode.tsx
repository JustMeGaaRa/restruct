import { FC, PropsWithChildren } from "react";
import { GroupNode, Text } from "@graph/svg";
import { useViewMetadata } from "../../containers";

export interface IDeploymentNode {
    type: "Deployment Node";
    identifier: string;
    name: string;
    description?: string;
    instances?: string;
}

export const DeploymentNode: FC<PropsWithChildren<{
    value: IDeploymentNode,
    borderWidth?: number;
    padding?: number;
}>> = ({
    children,
    value,
    borderWidth = 2,
    padding = 16,
}) => {
        const { metadata } = useViewMetadata();
        const dimensions = metadata?.elements[value.identifier] ?? {
            x: 0,
            y: 0,
            height: 350,
            width: 300,
        };
        // TODO: pass these default values to the Element component directly
        const { height = 400, width = 400 } = dimensions;

        return (
            <GroupNode
                id={value.identifier}
                className={"structurizr__element-deployment-node"}
                position={dimensions}
                height={height}
                width={width}
                backgroundColor={"none"}
                borderColor={"#535354"}
                borderDash={false}
            >
                <Text
                    x={borderWidth + padding}
                    y={height - borderWidth - padding - 16}
                    fontSize={14}
                    fontFamily={"Inter"}
                    fill={"#E8E8E8"}
                    style={{ whiteSpace: "pre" }}
                    width={width - padding * 2 - borderWidth * 2}
                >
                    {value.name}
                </Text>
                <Text
                    x={borderWidth + padding}
                    y={height - borderWidth - padding}
                    fontSize={11}
                    fontFamily={"Inter"}
                    fill={"#A1A2A3"}
                    style={{ whiteSpace: "pre" }}
                    width={width - padding * 2 - borderWidth * 2}
                >
                    {value.type}
                </Text>
                {children}
            </GroupNode>
        );
    };
