import { workspace } from "../../src/models";

let springPetClinit;
let webApplication;
let database;
let live;
let region;
let route53;
let elb;
let webApplicationInstance;
let databaseInstance;

export default workspace(
    "Amazon Web Services Example",
    "An example AWS deployment.",
    (_) => {
        _.model((_) => {
            springPetClinit = _.softwareSystem(
                "Spring PetClinic",
                "Allows employees to view and manage information regarding the veterinarians, the clients, and their pets.",
                (_) => {
                    webApplication = _.container(
                        "Web Application",
                        "Allows employees to view and manage information regarding the veterinarians, the clients, and their pets."
                    );
                    database = _.container(
                        "Database",
                        "Stores information regarding the veterinarians, the clients, and their pets."
                    );
                }
            );

            _.uses(webApplication, database, "Reads from and writes to"),
                (live = _.deploymentEnvironment("Live", (_) => {
                    region = _.deploymentNode("us-east-1", (_) => {
                        route53 = _.infrastructureNode(
                            "Route 53",
                            "Highly available and scalable cloud DNS service."
                        );
                        elb = _.infrastructureNode(
                            "Elastic Load Balancer",
                            "Automatically distributes incoming application traffic."
                        );

                        _.deploymentNode("Autoscaling group", (_) => {
                            _.deploymentNode("EC2 instance");

                            webApplicationInstance =
                                _.containerInstance(webApplication);
                        });

                        _.deploymentNode("Amazon RDS", (_) => {
                            _.deploymentNode("MySQL", (_) => {
                                databaseInstance =
                                    _.containerInstance(database);
                            });
                        });
                    });

                    _.uses(route53, elb, "Forwards requests to");
                    _.uses(elb, webApplicationInstance, "Forwards requests to");
                }));
        });

        _.views((_) => {
            _.deploymentView(
                springPetClinit.identifier,
                "Live",
                "AmazonWebServicesDeployment"
            );

            _.styles((_) => {
                _.element("Element", { shape: "roundedBox" });
                _.element("Person", { shape: "person" });
                _.element("Database", { shape: "cylinder" });
            });

            // _.themes(url("https://static.structurizr.com/themes/amazon-web-services-2020.04.30/theme.json"))
        });
    }
);
