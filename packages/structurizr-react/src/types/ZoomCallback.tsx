import { IElement } from "@restruct/structurizr-dsl";

export type ZoomCallback = (
    event: React.MouseEvent<HTMLButtonElement>,
    element: IElement
) => void;
