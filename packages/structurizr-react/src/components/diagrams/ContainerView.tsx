import { ContainerViewStrategy, IElement } from "@structurizr/dsl";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { IViewMetadata, ViewMetadataProvider } from "../../containers";
// import { ViewElementJsxVisitor } from "../../types";
import { useWorkspace } from "./Workspace";
import { createDefaultContainerView } from "../../utils";

export const ContainerView: FC<PropsWithChildren<{
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
                // const containerView = workspace.views.containers.find(x => x.key === value.key)
                //     ?? createDefaultContainerView(value.softwareSystemIdentifier);
                // const strategy = new ContainerViewStrategy(workspace.model, containerView);
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
