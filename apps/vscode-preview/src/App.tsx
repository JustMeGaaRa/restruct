import { IWorkspace } from "@restruct/structurizr-dsl";
import {
    RestructDarkTheme,
    ThemeProvider,
    ViewNavigationProvider,
} from "@restruct/structurizr-react";
import { WorkspaceChannel, WorkspacePreview } from "@restruct/ui";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { bigBankPlc } from "./workspace";

// NOTE: Injected by the build process or loaded via WebSocket
declare global {
    interface Window {
        __WS_PORT__?: number;
    }
}

export const App = () => {
    const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
    const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState(0);

    useEffect(() => {
        const isDevelopment = import.meta.env?.DEV;

        if (!window.__WS_PORT__) {
            console.error("[App] Missing __WS_PORT__");
            if (isDevelopment) {
                setWorkspaces([bigBankPlc]);
            }
            return;
        }

        const wsUrl = `ws://localhost:${window.__WS_PORT__}`;
        const channel = new WorkspaceChannel(wsUrl);

        channel.connect();
        const unsubscribe = channel.subscribe((wss) => {
            console.log("[App] Received workspace update");
            setWorkspaces(wss);
            setActiveWorkspaceIndex((index) =>
                index >= wss.length ? 0 : index
            );
        });

        let fallbackTimeout: number | undefined;
        if (isDevelopment) {
            fallbackTimeout = window.setTimeout(() => {
                setWorkspaces((prev) => {
                    if (prev.length === 0) {
                        console.warn(
                            "[App] WebSocket connection timeout, using fallback workspace"
                        );
                        return [bigBankPlc];
                    }
                    return prev;
                });
            }, 1000);
        }

        return () => {
            if (fallbackTimeout) {
                clearTimeout(fallbackTimeout);
            }
            unsubscribe();
            channel.disconnect();
        };
    }, []);

    if (workspaces.length === 0) {
        return (
            <Flex
                alignItems="center"
                justifyContent="center"
                h="100dvh"
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
        <Flex
            alignItems="center"
            justifyContent="center"
            bg="neutral.900"
            h="100vh"
            w="100vw"
            position="relative"
            overflow="hidden"
            flexDirection="column"
            color="white"
        >
            <ThemeProvider defaultTheme={RestructDarkTheme}>
                <ViewNavigationProvider
                    initialView={activeWorkspace.views.systemLandscape}
                >
                    <WorkspacePreview
                        workspace={activeWorkspace}
                        setWorkspace={(workspace) => {
                            const newWorkspaces = [...workspaces];
                            newWorkspaces[activeWorkspaceIndex] =
                                workspace as any;
                            setWorkspaces(newWorkspaces);
                        }}
                        availableWorkspaces={workspaces.map(
                            (workspace, index) => ({
                                id: String(index),
                                name:
                                    workspace.name || `Workspace ${index + 1}`,
                            })
                        )}
                        onWorkspaceSelect={(index) =>
                            setActiveWorkspaceIndex(Number(index))
                        }
                    />
                </ViewNavigationProvider>
            </ThemeProvider>
        </Flex>
    );
};
