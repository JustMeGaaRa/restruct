import { FC, PropsWithChildren } from "react";
import { Viewport } from "../";
import { ViewportProvider } from "../../containers";

export const Views: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ViewportProvider>
            <Viewport>
                {children}
            </Viewport>
        </ViewportProvider>
    );
};
