---
sidebar_position: 3
sidebar_label: Defining the Model
---

# Defining the Model

The model is the core of your architecture documentation. It's where you define the entities that make up your software systems and the relationships between them.

The model is defined within a `model` block inside a `workspace`.

```typescript
workspace("My Architecture", "A short description", (_) => {
    _.model((_) => {
        // Model elements go here
    });
});
```

## Model Elements

The Structurizr DSL supports the standard C4 model elements:

### Person

A person represents a human user of your software system.

```typescript
const user = _.person("User", "A user of our software system");
```

### Software System

A software system is the highest level of abstraction of something that provides value to its users.

```typescript
const internalSystem = _.softwareSystem(
    "Internal System",
    "A system within our organization"
);
const externalSystem = _.softwareSystem(
    "External System",
    "A third party API or service"
);
```

### Container

A container represents a technical entity such as a web application, a mobile app, a database server, or a microservice. It resides inside a Software System.

```typescript
const softwareSystem = _.softwareSystem("My System", "A system", (_) => {
    const webApplication = _.container(
        "Web Application",
        "An ASP.NET Core MVC application"
    );
    const database = _.container(
        "Database",
        "A Microsoft SQL Server database",
        (_) => {
            _.tags("Database", "Persistence");
        }
    );
});
```

### Component

A component is a part of a container. It's usually a grouping of related functionality behind an interface.

```typescript
const apiApplication = _.container("API Application", "A REST API", (_) => {
    const accountController = _.component(
        "Account Controller",
        "Handles user accounts"
    );
    const emailService = _.component(
        "Email Service",
        "Sends emails to customers"
    );
});
```

Note that the callback `(_)` is used for nesting or adding more metadata like tags or descriptions to the current element.

## Relationships

Relationships define how elements interact with each other. They are defined using the `uses` method.

```typescript
// Person using a Software System
_.uses(user.identifier, softwareSystem.identifier, "Sends email using");

// Container using another Container
_.uses(
    webApplication.identifier,
    database.identifier,
    "Reads from and writes to",
    "JDBC/HTTPS"
);
```

The standard arguments are `sourceIdentifier`, `targetIdentifier`, `description` (optional), and `technology` (optional).
