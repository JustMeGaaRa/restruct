import { IElement, SystemLandscapeViewStrategy } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
// import { ViewElementJsxVisitor } from "../../types";
import { useWorkspace } from "./Workspace";
import { createDefaultSystemLandscapeView } from "../../utils";

export const SystemLandscapeView: FC<PropsWithChildren<{
    value?: { key?: string };
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
                // const systemLandscapeView = workspace.views.systemLandscape
                //     ?? createDefaultSystemLandscapeView();
                // const visitor = new ViewElementJsxVisitor(onZoomInClick, onZoomOutClick);
                // const strategy = new SystemLandscapeViewStrategy(workspace.model, systemLandscapeView);
                // const elements = strategy.accept(visitor);
                // setElements(elements);
            }
        }, [workspace, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {elements}
                {children}
            </ViewMetadataProvider>
        );
    };
