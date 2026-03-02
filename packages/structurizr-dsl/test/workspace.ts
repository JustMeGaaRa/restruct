import {
    IComponent,
    IContainer,
    IDeploymentNode,
    IPerson,
    ISoftwareSystem,
    workspace,
} from "../src";

export const createBigBankPlcWorkspace = () => {
    let customer: IPerson;
    let supportStuff: IPerson;
    let internetBankingSystem: ISoftwareSystem;
    let backoffice: IPerson;
    let mainframe: ISoftwareSystem;
    let email: ISoftwareSystem;
    let atm: ISoftwareSystem;
    let singlePageApplication: IContainer;
    let mobileApp: IContainer;
    let webApplication: IContainer;
    let apiApplication: IContainer;
    let database: IContainer;
    let signinController: IComponent;
    let accountsSummaryController: IComponent;
    let resetPasswordController: IComponent;
    let securityComponent: IComponent;
    let mainframeBankingSystemFacade: IComponent;
    let emailSystemFacade: IComponent;
    let primaryDatabaseServer: IDeploymentNode;
    let secondaryDatabaseServer: IDeploymentNode;

    return workspace("Big Bank plc.", "", (_) => {
        _.description("A default architecture for Big Bank plc.");

        _.model((_) => {
            customer = _.person(
                "Personal Banking Customer",
                "A customer of the bank, with personal bank accounts.",
                (_) => _.tags("Customer")
            );

            _.group("Big Bank plc.", (_) => {
                supportStuff = _.person(
                    "Customer Service Staff",
                    "Customer service staff within the bank.",
                    (_) => _.tags("Support Staff")
                );
                backoffice = _.person(
                    "Back Office Staff",
                    "Administration and support staff within the bank.",
                    (_) => _.tags("Support Staff")
                );

                mainframe = _.softwareSystem("Mainframe Banking System", "");
                email = _.softwareSystem("E-mail System", "");
                atm = _.softwareSystem("ATM", "");

                internetBankingSystem = _.softwareSystem(
                    "Internet Banking System",
                    "",
                    (_) => {
                        singlePageApplication = _.container(
                            "Single-Page Application",
                            ""
                        );
                        mobileApp = _.container("Mobile App", "");
                        webApplication = _.container("Web Application", "");
                        apiApplication = _.container(
                            "API Application",
                            "",
                            (_) => {
                                signinController = _.component(
                                    "Sign In Controller",
                                    ""
                                );
                                accountsSummaryController = _.component(
                                    "Accounts Summary Controller",
                                    ""
                                );
                                resetPasswordController = _.component(
                                    "Reset Password Controller",
                                    ""
                                );
                                securityComponent = _.component(
                                    "Security Component",
                                    ""
                                );
                                mainframeBankingSystemFacade = _.component(
                                    "Mainframe Banking System Facade",
                                    ""
                                );
                                emailSystemFacade = _.component(
                                    "E-mail System Facade",
                                    ""
                                );
                            }
                        );
                        database = _.container("Database", "");
                    }
                );
            });

            _.deploymentEnvironment("Development", (_) => {
                _.deploymentNode("Developer Laptop", (_) => {
                    // _.tags("Microsoft Windows 10 or Apple macOS");
                    _.deploymentNode("Web Browser", (_) => {
                        // _.tags("Chrome, Firefox, Safari, or Edge");
                        const developerSinglePageApplicationInstance =
                            _.containerInstance(
                                singlePageApplication.identifier
                            );
                    });

                    _.deploymentNode("Docker Container - Web Server", (_) => {
                        _.deploymentNode("Apache Tomcat", (_) => {
                            const developerWebApplicationInstance =
                                _.containerInstance(webApplication.identifier);
                            const developerApiApplicationInstance =
                                _.containerInstance(apiApplication.identifier);
                        });
                    });

                    _.deploymentNode(
                        "Docker Container - Database Server",
                        (_) => {
                            // _.tags("Docker");
                            _.deploymentNode("Database Server", (_) => {
                                const developerDatabaseInstance =
                                    _.containerInstance(database.identifier);
                            });
                        }
                    );
                });

                _.deploymentNode("Big Bank plc", (_) => {
                    _.deploymentNode("bigbank-dev001", (_) => {
                        _.softwareSystemInstance(mainframe.identifier);
                    });
                });
            });

            _.deploymentEnvironment("Live", (_) => {
                _.deploymentNode("Customer's mobile device", (_) => {
                    const liveMobileAppInstance = _.containerInstance(
                        mobileApp.identifier
                    );
                });

                _.deploymentNode("Customer's computer", (_) => {
                    _.deploymentNode("Web Browser", (_) => {
                        const liveSinglePageApplicationInstance =
                            _.containerInstance(
                                singlePageApplication.identifier
                            );
                    });
                });

                _.deploymentNode("Big Bank plc", (_) => {
                    _.deploymentNode("bigbank-web***", (_) => {
                        _.deploymentNode("Apache Tomcat", (_) => {
                            const liveWebApplicationInstance =
                                _.containerInstance(webApplication.identifier);
                        });
                    });

                    _.deploymentNode("bigbank-api***", (_) => {
                        _.deploymentNode("Apache Tomcat", (_) => {
                            const liveApiApplicationInstance =
                                _.containerInstance(apiApplication.identifier);
                        });
                    });

                    _.deploymentNode("bigbank-db01", (_) => {
                        primaryDatabaseServer = _.deploymentNode(
                            "Oracle - Primary",
                            (_) => {
                                const livePrimaryDatabaseInstance =
                                    _.containerInstance(database.identifier);
                            }
                        );
                    });

                    _.deploymentNode("bigbank-db02", (_) => {
                        secondaryDatabaseServer = _.deploymentNode(
                            "Oracle - Secondary",
                            (_) => {
                                const liveSecondaryDatabaseInstance =
                                    _.containerInstance(database.identifier);
                            }
                        );
                    });

                    _.deploymentNode("bigbank-prod001", (_) => {
                        const mainframeInstance = _.softwareSystemInstance(
                            mainframe.identifier
                        );
                    });
                });

                _.uses(
                    primaryDatabaseServer.identifier,
                    secondaryDatabaseServer.identifier,
                    "Replicates data to"
                );
            });

            // relationships between people and software systems
            _.uses(
                customer.identifier,
                internetBankingSystem.identifier,
                "Views account balances, and makes payments using"
            );
            _.uses(
                internetBankingSystem.identifier,
                mainframe.identifier,
                "Gets account information from, and makes payments using"
            );
            _.uses(
                internetBankingSystem.identifier,
                email.identifier,
                "Sends e-mail using"
            );
            _.uses(email.identifier, customer.identifier, "Sends e-mails to");
            _.uses(
                customer.identifier,
                supportStuff.identifier,
                "Asks questions to"
            );
            _.uses(supportStuff.identifier, mainframe.identifier, "Uses");
            _.uses(customer.identifier, atm.identifier, "Withdraws cash using");
            _.uses(atm.identifier, mainframe.identifier, "Uses");
            _.uses(backoffice.identifier, mainframe.identifier, "Uses");

            // relationships to/from containers
            _.uses(
                customer.identifier,
                webApplication.identifier,
                "Visits bigbank.com/ib using"
            );
            _.uses(
                customer.identifier,
                singlePageApplication.identifier,
                "Views account balances, and makes payments using"
            );
            _.uses(
                customer.identifier,
                mobileApp.identifier,
                "Views account balances, and makes payments using"
            );
            _.uses(
                webApplication.identifier,
                singlePageApplication.identifier,
                "Delivers to the customer's web browser"
            );

            // relationships to/from components
            _.uses(
                singlePageApplication.identifier,
                signinController.identifier,
                "Makes API calls to"
            );
            _.uses(
                singlePageApplication.identifier,
                accountsSummaryController.identifier,
                "Makes API calls to"
            );
            _.uses(
                singlePageApplication.identifier,
                resetPasswordController.identifier,
                "Makes API calls to"
            );
            _.uses(
                mobileApp.identifier,
                signinController.identifier,
                "Makes API calls to"
            );
            _.uses(
                mobileApp.identifier,
                accountsSummaryController.identifier,
                "Makes API calls to"
            );
            _.uses(
                mobileApp.identifier,
                resetPasswordController.identifier,
                "Makes API calls to"
            );
            _.uses(
                signinController.identifier,
                securityComponent.identifier,
                "Uses"
            );
            _.uses(
                accountsSummaryController.identifier,
                mainframeBankingSystemFacade.identifier,
                "Uses"
            );
            _.uses(
                resetPasswordController.identifier,
                securityComponent.identifier,
                "Uses"
            );
            _.uses(
                resetPasswordController.identifier,
                emailSystemFacade.identifier,
                "Uses"
            );
            _.uses(
                securityComponent.identifier,
                database.identifier,
                "Reads from and writes to"
            );
            _.uses(
                mainframeBankingSystemFacade.identifier,
                mainframe.identifier,
                "Makes API calls to"
            );
            _.uses(
                emailSystemFacade.identifier,
                email.identifier,
                "Sends e-mail using"
            );
        });

        _.views((_) => {
            _.systemLandscapeView("SystemLandscape");
            _.systemContextView(
                internetBankingSystem.identifier,
                "SystemContext"
            );
            _.containerView(internetBankingSystem.identifier, "Containers");
            _.componentView(apiApplication.identifier, "Components");
            _.deploymentView(
                internetBankingSystem.identifier,
                "Development",
                "Development Deployment"
            );
            _.deploymentView(
                internetBankingSystem.identifier,
                "Live",
                "Live Deployment"
            );
        });
    });
};

export const createImpliedRelationshipsDummy = () => {
    let person: IPerson;
    let softwareSystem: ISoftwareSystem;
    let webApp: IContainer;

    return workspace("Implied Relationships", "", (_) => {
        _.model((_) => {
            person = _.person("User");

            softwareSystem = _.softwareSystem("Software System", "", (_) => {
                webApp = _.container("Web Application", "");
            });

            _.uses(person.identifier, webApp.identifier, "Uses");
        });

        _.views((_) => {
            _.systemContextView(softwareSystem.identifier, "System Context");
        });
    });
};

export const createImpliedRelationshipDummy2 = () => {
    let systemA: ISoftwareSystem;
    let containerA: IContainer;
    let componentA: IComponent;
    let componentB: IComponent;
    let containerB: IContainer;
    let systemB: ISoftwareSystem;
    let systemC: ISoftwareSystem;

    return workspace("Implied Relationships 2", "", (_) => {
        _.model((_) => {
            systemA = _.softwareSystem("Software System A", "", (_) => {
                containerA = _.container("Container A", "", (_) => {
                    componentA = _.component("Component A", "");
                    componentB = _.component("Component B", "");
                });
                containerB = _.container("Container B", "");
            });

            systemB = _.softwareSystem("Software System B", "");
            systemC = _.softwareSystem("Software System C", "");

            _.uses(
                componentA.identifier,
                containerB.identifier,
                "Component A uses Container B"
            );
            _.uses(
                componentB.identifier,
                systemC.identifier,
                "Component B uses System C"
            );
            _.uses(
                containerA.identifier,
                systemB.identifier,
                "Container A uses System B"
            );
        });

        _.views((_) => {
            _.systemLandscapeView("System Landscape");
            _.systemContextView(systemA.identifier, "System Context");
            _.containerView(systemA.identifier, "Containers");
            _.componentView(containerA.identifier, "Components");
        });
    });
};

export const createImpliedRelationshipDeploymentDummy = () => {
    let systemA: ISoftwareSystem;
    let containerA: IContainer;
    let systemB: ISoftwareSystem;
    let containerB: IContainer;

    return workspace("Implied Relationships Deployment", "", (_) => {
        _.model((_) => {
            systemA = _.softwareSystem("Software System A", "", (_) => {
                containerA = _.container("Container A", "");
            });

            systemB = _.softwareSystem("Software System B", "", (_) => {
                containerB = _.container("Container B", "");
            });

            // The explicit relationship is between the containers
            _.uses(
                containerA.identifier,
                containerB.identifier,
                "Container A uses Container B"
            );

            _.deploymentEnvironment("Production", (_) => {
                _.deploymentNode("Node A", (_) => {
                    _.containerInstance(containerA.identifier);
                });
                _.deploymentNode("Node B", (_) => {
                    _.containerInstance(containerB.identifier);
                });
            });
        });

        _.views((_) => {
            _.deploymentView(systemA.identifier, "Production", "Deployment");
        });
    });
};
