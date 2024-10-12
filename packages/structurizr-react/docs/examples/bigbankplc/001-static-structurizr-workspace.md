# Structurizr Workspace - Static Initialization

Key Points: Ideal for documentation or presentation of the existing architecture materials.

```jsx
import { Workspace } from "@structurizr/react";
import { FC } from "react";

export const App: FC = () => {
    return (
        <Workspace value={{ title: "Big Bank plc", description: "A quickstart example of the Big Bank plc workspace" }}>
            <Model>
                <Person value={{ identifier: "customer", name: "Personal Banking Customer", tags: ["Customer"] }} />
                <Group value={{ identifier: "group" }}>
                    <Person value={{ identifier: "supportStaff", name: "Customer Service Staff", tags: ["Bank Staff"] }} />
                    <Person value={{ identifier: "backoffice", name: "Back Office Staff", tags: ["Bank Staff"] }} />

                    <SoftwareSystem value={{ identifier: "mainframe", name: "Mainframe Banking System", tags: ["Existing System"] }} />
                    <SoftwareSystem value={{ identifier: "email", name: "E-mail System", tags: ["Existing System"] }} />
                    <SoftwareSystem value={{ identifier: "atm", name: "ATM", tags: ["Existing System"] }} />

                    <SoftwareSystem value={{ identifier: "internetBankingSystem", name: "Internet Banking System" }}>
                        <Container value={{ identifier: "singlePageApplication", name: "Single-Page Application" }} />
                        <Container value={{ identifier: "mobileApp", name: "Mobile App" }} />
                        <Container value={{ identifier: "webApplication", name: "Web Application" }} />

                        <Container value={{ identifier: "apiApplication", name: "API Application" }}>
                            <Component value={{ identifier: "signinController", name: "Sign In Controller" }} />
                            <Component value={{ identifier: "accountsSummaryController", name: "Accounts Summary Controller" }} />
                            <Component value={{ identifier: "resetPasswordController", name: "Reset Password Controller" }} />
                            <Component value={{ identifier: "securityComponent", name: "Security Component" }} />
                            <Component value={{ identifier: "mainframeBankingSystemFacade", name: "Mainframe Banking System Facade" }} />
                            <Component value={{ identifier: "emailComponent", name: "E-mail Component" }} />
                        </Container>

                        <Container value={{ identifier: "", name: "" }} />
                    </SoftawareSystem>
                </Group>

                <Relationship value={{ sourceIdentifer: "customer", targetIdentifier: "internetBankingSystem" }} />
                <Relationship value={{ sourceIdentifer: "internetBankingSystem", targetIdentifier: "mainframe" }} />
                <Relationship value={{ sourceIdentifer: "internetBankingSystem", targetIdentifier: "email" }} />
                <Relationship value={{ sourceIdentifer: "email", targetIdentifier: "customer" }} />
                <Relationship value={{ sourceIdentifer: "customer", targetIdentifier: "supportStaff" }} />
                <Relationship value={{ sourceIdentifer: "supportStaff", targetIdentifier: "mainframe" }} />
                <Relationship value={{ sourceIdentifer: "customer", targetIdentifier: "atm" }} />
                <Relationship value={{ sourceIdentifer: "atm", targetIdentifier: "mainframe" }} />
                <Relationship value={{ sourceIdentifer: "backoffice", targetIdentifier: "mainframe" }} />

                <DeploymentEnvironment value={{ environment: "Development" }}>
                    <DeploymentNode value={{ name: "Developer Laptop" }}>
                        <DeploymentNode value={{ name: "Web Browser" }}>
                            <ContainerInstance value={{ identifier: "developerSinglePageApplicationInstance" containerIdentifier: "singlePageApplication" }} />
                        </DeploymentNode>

                        <DeploymentNode value={{ name: "Docker Container - Web Server" }}>
                            <DeploymentNode value={{ name: "Apache Tomcat" }}>
                                <ContainerInstance value={{ identifier: "developerWebApplicationInstance" containerIdentifier: "webApplication" }} />
                                <ContainerInstance value={{ identifier: "developerApiApplicationInstance" containerIdentifier: "apiApplication" }} />
                            </DeploymentNode>
                        </DeploymentNode>

                        <DeploymentNode value={{ name: "Docker Container - Database Server" }}>
                            <DeploymentNode value={{ name: "Database Server" }}>
                                <ContainerInstance value={{ identifier: "developerDatabaseInstance" containerIdentifier: "database" }} />
                            </DeploymentNode>
                        </DeploymentNode>
                    </DeploymentNode>

                    <DeploymentNode value={{ name: "Big Bank plc" }}>
                        <DeploymentNode value={{ name: "bigbank-dev001" }}>
                            <SoftwareSystemInstance value={{ softwareSystemIdentifier: "mainframe" }} />
                        </DeploymentNode>
                    </DeploymentNode>
                </DeploymentEnvironment>
            </Model>
            <Views>
                <SystemLandscapeView value={{ key: "SystemLandscape" }}>
                    <Include value={"*"} />
                    <AutoLayout />
                </SystemLandscapeView>

                <SystemContextView value={{ softwareSystemIdentifier: "internetBankingSystem", key: "SystemContext" }}>
                    <Include value={"*"} />
                    <Animation value={["internetBankingSystem", "customer", "mainframe", "email"]} />
                    <AutoLayout />
                </SystemContextView>

                <ContainerView value={{ softwareSystemIdentifier: "internetBankingSystem", key: "Containers" }}>
                    <Include value={"*"} />
                    <Animation
                        value={[
                            ["customer", "mainframe", "email"],
                            "webApplication",
                            "singlePageApplication",
                            "mobileApp",
                            "apiApplication",
                            "database"
                        ]}
                    />
                    <AutoLayout />
                </ContainerView>

                <ComponentView value={{ containerIdentifier: "apiApplication", key: "Components" }}>
                    <Include value={"*"} />
                    <Animation
                        value={[
                            ["singlePageApplication", "mobileApp", "database", "email", "mainframe"],
                            ["signinController", "securityComponent"],
                            ["accountsSummaryController", "mainframeBankingSystemFacade"],
                            ["resetPasswordController", "emailComponent"]
                        ]}
                    />
                    <AutoLayout />
                </ComponentView>

                <DeploymentView value={{ softwareSystemIdentifier: "internetBankingSystem" environment: "Development", key: "DevelopmentDeployment" }}>
                    <Include value={"*"} />
                    <Animation
                        value={[
                            "developerSinglePageApplicationInstance",
                            ["developerWebApplicationInstance", "developerApiApplicationInstance"],
                            "developerDatabaseInstance"
                        ]}
                    />
                    <AutoLayout />
                </DeploymentView>
            </Views>
        </Workspace>
    )
}
```
