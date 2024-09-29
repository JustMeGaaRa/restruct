import { FC, useEffect } from "react";
import { useViewMetadata } from "../../containers";

export interface IAutoLayout {

}

export const AutoLayout: FC<{ value: IAutoLayout }> = ({ value }) => {
    const { metadata, setMetadata } = useViewMetadata();

    useEffect(() => {
        // const autoLayout = new GraphvizLayoutStrategy();
        // const metadataAuto = autoLayout.execute(metadata);
        // setMetadata(metadataAuto);
    }, [metadata, setMetadata]);

    return null;
};
