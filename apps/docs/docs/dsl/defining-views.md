---
sidebar_position: 4
sidebar_label: Defining Views
---

# Defining Views

Views are how you visualize your software architecture. They are defined inside a `views` block within a `workspace`.

```typescript
workspace("Example Architecture", "A short description", (_) => {
    _.views((_) => {
        // Views go here
    });
});
```

The Views block allows you to define multiple viewpoints of the same architecture.

## View Types

There are five main types of views supported by the Structurizr DSL:

### System Landscape View

The System Landscape View is the highest-level view that encompasses your entire organization or enterprise. It's used to show how multiple software systems interact.

```typescript
_.systemLandscapeView(
    "SystemLandscape",
    "A landscape view of our architecture"
);
```

### System Context View

The System Context View focuses on a single software system and shows its relationships with actors and other systems. It's often used as the primary entry point for a system.

```typescript
_.systemContextView(
    mySystem.identifier,
    "SystemContext",
    "Our primary system and its surroundings"
);
```

### Container View

The Container View shows the internal structure of a Software System. It should show the containers within that system and how they interact with each other and external systems.

```typescript
_.containerView(
    mySystem.identifier,
    "Containers",
    "The internal architectural view of our system"
);
```

### Component View

The Component View shows the internal structure of a Container. It should show the components within that container and how they interact with each other and other systems.

```typescript
_.componentView(
    myContainer.identifier,
    "Components",
    "The components inside our API application"
);
```

### Deployment View

The Deployment View shows how your containers or systems are mapped to infrastructure. This includes servers, nodes, browsers, etc.

```typescript
_.deploymentView(
    mySystem.identifier,
    "Production",
    "The production environment deployment"
);
```

## Styling and Themes

The Views block is also where you define themes and styles to apply to your diagrams.

```typescript
_.theme(
    "https://static.structurizr.com/themes/amazon-web-services-2023.01.31/theme.json"
);

_.styles((_) => {
    _.element("Person", (_) => {
        _.shape("Person");
        _.background("#08427b");
        _.color("#ffffff");
    });
});
```

The themes are external JSON files that specify colors and backgrounds for your C4 elements.
