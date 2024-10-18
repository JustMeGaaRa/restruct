import { FC, PropsWithChildren } from "react";
import { Box } from "@graph/svg";
import { useViewMetadata } from "../../containers";

export interface ISoftwareSystemInstance {
    type: "Software System Instance";
    identifier: string;
    softwareSystemIdentifier: string;
}

export const SoftwareSystemInstance: FC<PropsWithChildren<{
    value: ISoftwareSystemInstance;
}>> = ({
    children,
    value,
}) => {
        const { metadata } = useViewMetadata();
        const dimensions = metadata?.elements[value.identifier] ?? {
            x: 0,
            y: 0,
            height: 200,
            width: 200,
        };

        return (
            <Box position={dimensions} id={value.identifier}>
                {children}
            </Box>
        );
    };
