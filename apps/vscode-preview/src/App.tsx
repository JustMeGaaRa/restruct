import { IWorkspace } from "@structurizr/dsl";
import { RestructDarkTheme, ThemeProvider } from "@structurizr/react";
import { WorkspaceChannel, WorkspacePreview } from "@restruct/ui";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

declare global {
    interface Window {
        __WS_PORT__?: number;
    }
}

export const App = () => {
    const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
    const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState(0);

    useEffect(() => {
        if (!window.__WS_PORT__) {
            console.error("[App] Missing __WS_PORT__");
            return;
        }

        const wsUrl = `ws://localhost:${window.__WS_PORT__}`;
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
