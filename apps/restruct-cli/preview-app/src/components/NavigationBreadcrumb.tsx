import { Breadcrumbs } from "@restruct/ui";
import { ViewType } from "@structurizr/dsl";
import { useViewNavigation } from "@structurizr/react";

export const NavigationBreadcrumb = () => {
    const { currentView } = useViewNavigation();

    if (!currentView) return null;

    const items = [];

    if (currentView.type === ViewType.SystemLandscape) {
        items.push({ label: "System Landscape", onClick: () => {} });
    } else if (currentView.type === ViewType.SystemContext) {
        items.push({ label: "System Context", onClick: () => {} });
        items.push({
            label: (currentView as any).softwareSystem || currentView.key,
            onClick: () => {},
        });
    } else if (currentView.type === ViewType.Container) {
        items.push({ label: "Container", onClick: () => {} });
        items.push({
            label: (currentView as any).softwareSystem || currentView.key,
            onClick: () => {},
        });
    } else if (currentView.type === ViewType.Component) {
        items.push({ label: "Component", onClick: () => {} });
        items.push({
            label: (currentView as any).container || currentView.key,
            onClick: () => {},
        });
    } else if (currentView.type === ViewType.Deployment) {
        items.push({ label: "Deployment", onClick: () => {} });
        items.push({
            label: (currentView as any).environment || currentView.key,
            onClick: () => {},
        });
    } else if (currentView.type === ViewType.Model) {
        items.push({ label: "Model", onClick: () => {} });
    }

    return <Breadcrumbs items={items} />;
};
