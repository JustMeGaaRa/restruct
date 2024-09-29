import { ComponentViewStrategy, IComponentView } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
import { ViewElementJsxVisitor, ZoomCallback } from "../../types";
import { createDefaultComponentView } from "../../utils";
import { useWorkspace } from "./Workspace";

export const ComponentView: FC<PropsWithChildren<{
    value: IComponentView;
    metadata?: IViewMetadata;
    onZoomInClick?: ZoomCallback;
    onZoomOutClick?: ZoomCallback;
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
                const visitor = new ViewElementJsxVisitor(onZoomInClick, onZoomOutClick);
                const componentView = workspace.views.components.find(x => x.key === value.key)
                    ?? createDefaultComponentView(value.containerIdentifier);
                const strategy = new ComponentViewStrategy(workspace.model, componentView);
                const elements = strategy.accept(visitor);
                setElements(elements);
            }
        }, [workspace, value.key, value.containerIdentifier, onZoomInClick, onZoomOutClick]);

        return (
            <ViewMetadataProvider metadata={metadata}>
                {elements}
                {children}
            </ViewMetadataProvider>
        );
    };
