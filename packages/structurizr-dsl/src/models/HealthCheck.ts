import { Url } from "../interfaces";

type HealthCheckParams = Required<Pick<HealthCheck, "name" | "url">> &
    Partial<Omit<HealthCheck, "name" | "url">>;

export class HealthCheck {
    constructor(params: HealthCheckParams) {
        this.name = params.name;
        this.url = params.url;
        this.interval = params.interval;
        this.timeout = params.timeout;
    }

    public readonly name!: string;
    public readonly url!: Url;
    public readonly interval?: number;
    public readonly timeout?: number;
}
