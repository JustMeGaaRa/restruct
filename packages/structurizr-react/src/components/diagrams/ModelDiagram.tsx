import { useViewport } from "@graph/svg";
import {
    createModelDiagram,
    IModelDiagram,
    IModelView,
    ViewType,
} from "@structurizr/dsl";
import { FC, PropsWithChildren, useState } from "react";
import {
    IViewMetadata,
    useWorkspace,
    ViewMetadataProvider,
} from "../../containers";
import { useEffect } from "react";
import { autolayoutDiagram } from "../../utils";
import { ElementWrapper } from "./ElementWrapper";
import { Relationship } from "./Relationship";

export const ModelDiagram: FC<
    PropsWithChildren<{
        value: IModelView;
    }>
> = ({ children, value }) => {
    const { workspace } = useWorkspace();
    const { autofit, fitBounds, getBounds } = useViewport();
    const [diagram, setDiagram] = useState<IModelDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const diagram = createModelDiagram(workspace);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Model).then(setMetadata);
        }
    }, [workspace, value.key]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    return (
        <ViewMetadataProvider metadata={metadata} setMetadata={setMetadata}>
            {diagram?.supportingElements.map((element) => (
                <ElementWrapper key={element.identifier} value={element} />
            ))}
            {diagram?.relationships.map((relationship) => (
                <Relationship
                    key={relationship.identifier}
                    value={relationship}
                />
            ))}
            {children}
        </ViewMetadataProvider>
    );
};
