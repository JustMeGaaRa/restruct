import { IPerson } from "../../interfaces";
import { IBuilder } from "../../shared";
import { Person } from "../Person";

export class PersonBuilder implements IBuilder<IPerson> {
    private person: IPerson;

    private idPath: string;

    constructor(name: string, description?: string, parentPath: string = "") {
        this.idPath = parentPath ? `${parentPath}/Person:${name}` : `Person:${name}`;
        this.person = new Person({
            identifier: this.idPath,
            name,
            description,
        }).toSnapshot();
    }

    tags(...tags: string[]): this {
        this.person = new Person({
            ...this.person,
            tags: tags.map((tag) => ({ name: tag })),
        }).toSnapshot();
        return this;
    }

    build(): IPerson {
        return this.person;
    }
}
