import { IPerson } from "../../interfaces";
import { IBuilder } from "../../shared";
import { Person } from "../Person";

export class PersonBuilder implements IBuilder<IPerson> {
    private person: IPerson;

    constructor(name: string, description?: string) {
        this.person = new Person({
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
