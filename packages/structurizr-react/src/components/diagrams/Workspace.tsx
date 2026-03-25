import { FC, PropsWithChildren } from "react";

export const Workspace: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div
            className={"structurizr__workspace"}
            style={{
                position: "relative",
                margin: "0px",
                padding: "0px",
                height: "100%",
                width: "100%",
                overflow: "hidden",
            }}
        >
            {children}
        </div>
    );
};
