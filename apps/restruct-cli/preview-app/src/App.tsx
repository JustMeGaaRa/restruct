import { IWorkspace } from "@structurizr/dsl";
import {
    NavigationBreadcrumb,
    WorkspaceChannel,
    WorkspacePreview,
} from "@restruct/ui";
import { useState, useEffect } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { RestructDarkTheme, ThemeProvider } from "@structurizr/react";

// Injected by the build process or loaded via WebSocket
declare global {
    interface Window {
        __WORKSPACE__: IWorkspace;
    }
}

export const App = () => {
    const [workspace, setWorkspace] = useState<IWorkspace | null>(
        window.__WORKSPACE__ || null
    );

    useEffect(() => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/_restruct_ws`;
        const channel = new WorkspaceChannel(wsUrl);

        channel.connect();
        const unsubscribe = channel.subscribe((ws) => {
            console.log("[App] Received workspace update");
            setWorkspace(ws);
        });

        return () => {
            unsubscribe();
            channel.disconnect();
        };
    }, []);

    if (!workspace) {
        return (
            <Flex
                h="100vh"
                w="100vw"
                align="center"
                justify="center"
                bg="neutral.900"
                color="white"
            >
                <Spinner size="xl" />
                <Text>Loading workspace...</Text>
            </Flex>
        );
    }

    return (
        <ThemeProvider theme={RestructDarkTheme}>
            <WorkspacePreview
                workspace={workspace}
                setWorkspace={setWorkspace}
                diagramBreadcrumb={<NavigationBreadcrumb />}
            />
        </ThemeProvider>
    );
};
