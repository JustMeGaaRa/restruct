import { FC, useEffect } from "react";
import { useViewMetadata } from "../../containers";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAutoLayout {}

export const AutoLayout: FC<{ value: IAutoLayout }> = () => {
    const { metadata, setMetadata } = useViewMetadata();

    // TODO(SSR): apply auto layout synchronously
    useEffect(() => {}, [metadata, setMetadata]);

    return null;
};
