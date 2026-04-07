import { IWorkspace } from "@restruct/structurizr-dsl";
import {
    RestructDarkTheme,
    ThemeProvider,
    ViewNavigationProvider,
    WorkspaceProvider,
} from "@restruct/structurizr-react";
import {
    ElementControlsOverlay,
    WorkspaceChannel,
    WorkspacePreview,
} from "@restruct/ui";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// NOTE: Injected by the build process or loaded via WebSocket
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
                <Spinner size="lg" color="white" mr={4} borderWidth="2px" />
                <Text>Loading workspace...</Text>
            </Flex>
        );
    }

    const activeWorkspace = workspaces[activeWorkspaceIndex] as IWorkspace;

    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            bg="neutral.900"
            h="100vh"
            w="100vw"
            position="relative"
            overflow="hidden"
            flexDirection="column"
        >
            <ThemeProvider defaultTheme={RestructDarkTheme}>
                <WorkspaceProvider
                    workspace={activeWorkspace}
                    setWorkspace={(workspace) => {
                        const newWorkspaces = [...workspaces];
                        newWorkspaces[activeWorkspaceIndex] = workspace as any;
                        setWorkspaces(newWorkspaces);
                    }}
                    // TODO (navigation): move this overlay to workspace preview
                    // pass zoom in/out handlers to it to change to "diagrams" view mode when zoom in/out
                    renderElementOverlay={(element, _, state) => (
                        <ElementControlsOverlay
                            element={element}
                            state={state}
                        />
                    )}
                >
                    <ViewNavigationProvider
                        initialView={activeWorkspace.views.systemLandscape}
                    >
                        <WorkspacePreview
                            availableWorkspaces={workspaces.map(
                                (ws, index) => ({
                                    id: String(index),
                                    name: ws.name || `Workspace ${index + 1}`,
                                })
                            )}
                            onWorkspaceSelect={(index) =>
                                setActiveWorkspaceIndex(Number(index))
                            }
                        />
                    </ViewNavigationProvider>
                </WorkspaceProvider>
            </ThemeProvider>
        </Flex>
    );
};
