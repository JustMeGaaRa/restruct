import { IWorkspace } from "@structurizr/dsl";
import { WorkspaceChannel, WorkspacePreview } from "@restruct/ui";
import { useState, useEffect } from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { RestructDarkTheme, ThemeProvider } from "@structurizr/react";

// Injected by the build process or loaded via WebSocket
declare global {
    interface Window {
        __WORKSPACES__?: IWorkspace[];
    }
}

export const App = () => {
    const [workspaces, setWorkspaces] = useState<IWorkspace[]>(
        window.__WORKSPACES__ || []
    );
    const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState(0);

    useEffect(() => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/_restruct_ws`;
        const channel = new WorkspaceChannel(wsUrl);

        channel.connect();
        const unsubscribe = channel.subscribe((wss) => {
            console.log("[App] Received workspace update");
            setWorkspaces(wss);
            // reset active index if the new workspaces array is smaller
            setActiveWorkspaceIndex((curr) => (curr >= wss.length ? 0 : curr));
        });

        return () => {
            unsubscribe();
            channel.disconnect();
        };
    }, []);

    if (workspaces.length === 0) {
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

    const activeWorkspace = workspaces[activeWorkspaceIndex] as IWorkspace;

    return (
        <ThemeProvider theme={RestructDarkTheme}>
            <WorkspacePreview
                workspace={activeWorkspace}
                setWorkspace={(newWs) => {
                    const newWorkspaces = [...workspaces];
                    newWorkspaces[activeWorkspaceIndex] = newWs;
                    setWorkspaces(newWorkspaces);
                }}
                availableWorkspaces={workspaces.map((ws, i) => ({
                    id: String(i),
                    name: ws.name || `Workspace ${i + 1}`,
                }))}
                onWorkspaceSelect={(id) => setActiveWorkspaceIndex(Number(id))}
            />
        </ThemeProvider>
    );
};
