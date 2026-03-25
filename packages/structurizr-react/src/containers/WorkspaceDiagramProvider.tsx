import { createContext, FC, PropsWithChildren, useContext } from "react";
import { Diagram } from "../types";
import { IViewMetadata } from "./ViewMetadataProvider";

const WorkspaceDiagramContext = createContext<{
    diagrams: Map<string, Diagram>;
    metadata: Map<string, IViewMetadata>;
}>({
    diagrams: new Map(),
    metadata: new Map(),
});

export const WorkspaceDiagramProvider: FC<
    PropsWithChildren<{
        diagrams: Map<string, Diagram>;
        metadata: Map<string, IViewMetadata>;
    }>
> = ({ children, diagrams, metadata }) => {
    return (
        <WorkspaceDiagramContext.Provider
            value={{
                diagrams,
                metadata,
            }}
        >
            {children}
        </WorkspaceDiagramContext.Provider>
    );
};

export const useWorkspaceDiagram = () => {
    return useContext(WorkspaceDiagramContext);
};
