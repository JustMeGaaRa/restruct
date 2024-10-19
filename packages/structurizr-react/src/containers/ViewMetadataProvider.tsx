import {
    createContext,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
} from "react";

export interface IElementMetadata {
    x: number;
    y: number;
    height?: number;
    width?: number;
}

export type IRelationshipMetadata = Array<{ x: number; y: number }>;

export interface IViewMetadata {
    key?: string;
    elements: Record<string, IElementMetadata>;
    relationships: Record<string, IRelationshipMetadata>;
}

const ViewMetadataContext = createContext<{
    metadata?: IViewMetadata;
    setMetadata?: React.Dispatch<SetStateAction<IViewMetadata>>;
}>({
    metadata: {
        elements: {},
        relationships: {},
    },
    setMetadata: () => { console.debug("setMetadata not implemented"); },
});

export const ViewMetadataProvider: FC<PropsWithChildren<{
    metadata?: IViewMetadata;
    setMetadata?: React.Dispatch<SetStateAction<IViewMetadata>>;
}>> = ({
    children,
    metadata,
    setMetadata = () => { console.debug("setMetadata not implemented"); },
}) => {
        return (
            <ViewMetadataContext.Provider value={{ metadata, setMetadata }}>
                {children}
            </ViewMetadataContext.Provider>
        );
    };

export const useViewMetadata = () => {
    const { metadata, setMetadata } = useContext(ViewMetadataContext);

    const getElementMetadataById = useCallback((elementIdentifier: string) => {
        return metadata?.elements[elementIdentifier];
    }, [metadata]);

    const getRElationshipMetadataById = useCallback((relationshipIdentifier: string) => {
        return metadata?.relationships[relationshipIdentifier];
    }, [metadata]);

    return {
        metadata,
        setMetadata,
        getElementMetadataById,
        getRElationshipMetadataById,
    };
};
