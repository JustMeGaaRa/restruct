import { ElementStyleCollection, RelationshipStyleCollection } from "../models";

export interface ITheme {
    name: string;
    description: string;
    elements: ElementStyleCollection;
    relationships: RelationshipStyleCollection;
}
