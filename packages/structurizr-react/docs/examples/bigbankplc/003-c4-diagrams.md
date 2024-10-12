# Structurizr Workspace - C4 Diagrams

```jsx
import { Workspace } from "@structurizr/react";
import { FC } from "react";

export const App: FC = () => {
    const [ workspace, setWorkspace ] = useState<IWorkspace>();
    const [selectedView] = useState(workspace.views.systemLandscape);

    useEffect(() => {
        const fetchWorkspace = async () => {
            const url = "https://raw.githubusercontent.com//JustMeGaaRa/reverse-architecture-community/main/workspaces/big-bank-plc/workspace.dsl";
            const response = await fetch(url);
            const structurizr = await response.text();
            return structurizr;
        }

        fetchWorkspace()
            .then(structurizr => {
                setWorkspace(parseStructurizr(structurizr));
            })
            .catch(error => {
                setWorkspace(emptyWorkspace());
            });
    }, []);

    return (
        <Workspace value={workspace}>
            {/* NOTE: you just need to render any single view at a time, otherwise multiple views will be rendered */}
            {selectedView?.key === workspace.views.systemLandscape?.key && (
                <SystemLandscapeDiagram key={workspace.views.systemLandscape.identifier} value={workspace.views.systemLandscape}>
                    <Animation value={view.animation} />
                    <AutoLayout value={workspace.views.systemLandscape.autoLayout} />
                </SystemLandscapeView>
            )}
            {workspace.views.systemContexts.filter(x => x.key === selectedView?.key).map(view => (
                <SystemContextDiagram key={view.identifier} value={view}>
                    <Animation value={view.animation} />
                    <AutoLayout value={view.autoLayout} />
                </SystemContextView>
            ))}
            {workspace.views.containers.filter(x => x.key === selectedView?.key).map(view => (
                <ContainerDiagram key={view.identifier} value={view}>
                    <Animation value={view.animation} />
                    <AutoLayout value={view.autoLayout} />
                </ContainerView>
            ))}
            {workspace.views.components.filter(x => x.key === selectedView?.key).map(view => (
                <ComponentDiagram key={view.identifier} value={view}>
                    <Animation value={view.animation} />
                    <AutoLayout value={view.autoLayout} />
                </ComponentView>
            ))}
            {workspace.views.deployments.filter(x => x.key === selectedView?.key).map(view => (
                <DeploymentDiagram key={view.identifier} value={view}>
                    <Animation value={view.animation} />
                    <AutoLayout value={view.autoLayout} />
                </DeploymentView>
            ))}
        </Workspace>
    )
}
```
