import { workspace } from "../../src/models";

let customer;
let supportStuff;
let internetBankingSystem;
let backoffice;
let mainframe;
let email;
let atm;
let singlePageApplication;
let mobileApp;
let webApplication;
let apiApplication;
let database;
let signinController;
let accountsSummaryController;
let resetPasswordController;
let securityComponent;
let mainframeBankingSystemFacade;
let emailSystemFacade;

// Example usage of the fluent API with callbacks
export default workspace("Big Bank plc.", "", (_) => {
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
                "Mainframe Banking System",
                "",
                (_) => {
                    (singlePageApplication = _.container(
                        "Single-Page Application",
                        ""
                    )),
                        (mobileApp = _.container("Mobile App", ""));
                    webApplication = _.container("Web Application", "");
                    apiApplication = _.container("API Application", "", (_) => {
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
                    });
                    database = _.container("Database", "");
                }
            );
        });

        _.uses(
            customer.identifier,
            internetBankingSystem.identifier,
            "Views account balances, and makes payments using"
        );
    });

    _.views((_) => {
        _.systemLandscapeView("SystemLandscape");
        _.systemContextView(internetBankingSystem.identifier, "SystemContext");
    });
});
