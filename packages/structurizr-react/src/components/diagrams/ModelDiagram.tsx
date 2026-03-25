import { useViewport } from "@restruct/react-svg";
import {
    createModelDiagram,
    IModelDiagram,
    IModelView,
    ViewType,
} from "@restruct/structurizr-dsl";
import { FC, PropsWithChildren, useState } from "react";
import {
    IViewMetadata,
    useWorkspace,
    ViewMetadataProvider,
    useWorkspaceDiagram,
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
    const { diagrams: precalculatedDiagrams, metadata: precalculatedMetadata } =
        useWorkspaceDiagram();
    const { autofit, fitBounds, getBounds } = useViewport();

    const [diagram, setDiagram] = useState<IModelDiagram | null>(null);
    const [metadata, setMetadata] = useState<IViewMetadata>({
        key: "",
        elements: {},
        relationships: {},
    });

    useEffect(() => {
        if (workspace) {
            const diagram = createModelDiagram(workspace);
            setDiagram(diagram);

            autolayoutDiagram(diagram, ViewType.Model, "layered").then(
                setMetadata
            );
        }
    }, [workspace, value.key]);

    useEffect(() => {
        if (autofit) {
            fitBounds(getBounds());
        }
    }, [autofit, metadata, fitBounds, getBounds]);

    const targetDiagram =
        (precalculatedDiagrams.get(value.key) as IModelDiagram) ?? diagram;
    const targetMetadata = precalculatedMetadata.get(value.key) ?? metadata;

    return (
        <ViewMetadataProvider
            metadata={targetMetadata}
            setMetadata={setMetadata}
        >
            {targetDiagram?.supportingElements.map((element) => (
                <ElementWrapper key={element.identifier} value={element} />
            ))}
            {targetDiagram?.relationships.map((relationship) => (
                <Relationship
                    key={relationship.identifier}
                    value={relationship}
                />
            ))}
            {children}
        </ViewMetadataProvider>
    );
};
