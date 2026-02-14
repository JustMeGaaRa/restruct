import { FC, useEffect } from "react";
import { useViewMetadata } from "../../containers";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAutoLayout {}

export const AutoLayout: FC<{ value: IAutoLayout }> = () => {
    const { metadata, setMetadata } = useViewMetadata();

    useEffect(() => {}, [metadata, setMetadata]);

    return null;
};
