import { FC, useEffect } from "react";
import { useViewMetadata } from "../../containers";

export interface IAutoLayout {

}

export const AutoLayout: FC<{ value: IAutoLayout }> = ({ value }) => {
    const { metadata, setMetadata } = useViewMetadata();

    useEffect(() => {

    }, [metadata, setMetadata]);

    return null;
};
