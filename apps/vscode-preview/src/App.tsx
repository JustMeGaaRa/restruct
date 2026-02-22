import { IWorkspace } from "@structurizr/dsl";
import { RestructDarkTheme, ThemeProvider } from "@structurizr/react";
import {
    NavigationBreadcrumb,
    WorkspaceChannel,
    WorkspacePreview,
} from "@restruct/ui";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

declare global {
    interface Window {
        __WS_PORT__?: number;
    }
}

export const App = () => {
    const [workspace, setWorkspace] = useState<IWorkspace | null>(null);

    useEffect(() => {
        if (!window.__WS_PORT__) {
            console.error("[App] Missing __WS_PORT__");
            return;
        }

        const wsUrl = `ws://localhost:${window.__WS_PORT__}`;
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
                alignItems="center"
                justifyContent="center"
                h="100vh"
                w="100vw"
                bg="neutral.900"
                color="white"
            >
                <Spinner size="lg" color="white" mr={4} borderWidth="2px" />
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
