import { IElement, SystemContextViewStrategy } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
// import { ViewElementJsxVisitor } from "../../types";
import { useWorkspace } from "./Workspace";
import { createDefaultSystemContextView } from "../../utils";

export const SystemContextView: FC<PropsWithChildren<{
    value: { key?: string; softwareSystemIdentifier: string; };
    metadata?: IViewMetadata;
    onZoomInClick?: (event: React.MouseEvent<HTMLButtonElement>, element: IElement) => void;
    onZoomOutClick?: (event: React.MouseEvent<HTMLButtonElement>, element: IElement) => void;
}>> = ({
    children,
    value,
    metadata,
    onZoomInClick,
    onZoomOutClick,
}) => {
        const { workspace } = useWorkspace();
        const [elements, setElements] = useState<JSX.Element[]>([]);

        useEffect(() => {
            if (workspace) {
                // const visitor = new ViewElementJsxVisitor(onZoomInClick, onZoomOutClick);
                // const systemContextView = workspace.views.systemContexts.find(x => x.key === value.key)
                //     ?? createDefaultSystemContextView(value.softwareSystemIdentifier);
                // const strategy = new SystemContextViewStrategy(workspace.model, systemContextView);
                // const elements = strategy.accept(visitor);
                // setElements(elements);
            }
        }, [workspace, value.key, value.softwareSystemIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {elements}
                {children}
            </ViewMetadataProvider>
        );
    };
