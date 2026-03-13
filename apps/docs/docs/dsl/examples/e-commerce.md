---
sidebar_position: 2
sidebar_label: E-Commerce
---

# E-Commerce Example

This document provides a full example of a software architecture defined using the Structurizr DSL. It demonstrates how to combine the elements and views into a single, cohesive architecture description.

The following example describes a simple e-commerce system with an internal banking system and an external email service.

```typescript
import { workspace } from "@restruct/structurizr-dsl";

export default workspace(
    "E-Commerce System",
    "A comprehensive architecture for an e-commerce platform.",
    (_) => {
        // Model defines the people and software systems
        _.model((_) => {
            const customer = _.person(
                "Customer",
                "A customer who wants to buy something"
            );
            const backoffice = _.person(
                "Back Office Staff",
                "Administration and support staff within the company"
            );

            const eCommerceSystem = _.softwareSystem(
                "E-Commerce System",
                "The primary e-commerce software system.",
                (_) => {
                    const webApplication = _.container(
                        "Web Application",
                        "Delivers the static content and the single-page application.",
                        (_) => {
                            _.tags("Web Server");
                        }
                    );
                    const apiApplication = _.container(
                        "API Application",
                        "Provides the core business logic via a JSON/HTTPS API.",
                        (_) => {
                            _.tags("API");
                            const shoppingCartController = _.component(
                                "Shopping Cart Controller",
                                "Handles adding items to the shopping cart."
                            );
                            const orderController = _.component(
                                "Order Controller",
                                "Handles placing and fulfilling orders."
                            );
                            const paymentService = _.component(
                                "Payment Service",
                                "Integrates with external payment gateways."
                            );
                        }
                    );
                    const database = _.container(
                        "Database",
                        "Stores user registration information, hashed authentication credentials, access logs, etc.",
                        (_) => {
                            _.tags("Database");
                        }
                    );

                    // Container-level relationships
                    _.uses(
                        webApplication.identifier,
                        apiApplication.identifier,
                        "Makes API calls to",
                        "JSON/HTTPS"
                    );
                    _.uses(
                        apiApplication.identifier,
                        database.identifier,
                        "Reads from and writes to",
                        "JDBC"
                    );
                }
            );

            const bankingSystem = _.softwareSystem(
                "Banking System",
                "Our internal banking system for handling payments."
            );
            const emailSystem = _.softwareSystem(
                "E-mail System",
                "A third-party SaaS for sending e-mails."
            );

            // System-level relationships
            _.uses(customer.identifier, eCommerceSystem.identifier, "Uses");
            _.uses(
                backoffice.identifier,
                eCommerceSystem.identifier,
                "Administers"
            );
            _.uses(
                eCommerceSystem.identifier,
                bankingSystem.identifier,
                "Sends payment requests to"
            );
            _.uses(
                eCommerceSystem.identifier,
                emailSystem.identifier,
                "Sends e-mail using"
            );
            _.uses(
                emailSystem.identifier,
                customer.identifier,
                "Sends e-mails to"
            );
        });

        // Views define how the model should be visualized
        _.views((_) => {
            _.systemLandscapeView(
                "SystemLandscape",
                "A landscape view of our enterprise architecture."
            );
            _.systemContextView(
                "E-Commerce System",
                "SystemContext",
                "Our e-commerce system and its surroundings."
            );
            _.containerView(
                "E-Commerce System",
                "Containers",
                "The internal architectural view of our system."
            );

            // Define styles for elements
            _.styles((_) => {
                _.element("Software System", (_) => {
                    _.background("#1168bd");
                    _.color("#ffffff");
                });
                _.element("Person", (_) => {
                    _.shape("Person");
                    _.background("#08427b");
                    _.color("#ffffff");
                });
                _.element("Database", (_) => {
                    _.shape("Cylinder");
                });
            });
        });
    }
);
```

This script can be run to generate a workspace object that can be exported to a JSON file and visualized by tools that support the Structurizr workspace format.
