import { ModelViewStrategy } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
// import { ModelElementJsxVisitor } from "../../types";
import { useWorkspace } from "./Workspace";

export const ModelView: FC<PropsWithChildren<{
    metadata?: IViewMetadata;
}>> = ({
    children,
    metadata
}) => {
        const { workspace } = useWorkspace();
        const [elements, setElements] = useState<JSX.Element[]>([]);

        useEffect(() => {
            if (workspace) {
                // const visitor = new ModelElementJsxVisitor();
                // const strategy = new ModelViewStrategy(workspace);
                // const elements = strategy.accept(visitor);
                // setElements(elements);
            }
        }, [workspace]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {elements}
                {children}
            </ViewMetadataProvider>
        );
    };
